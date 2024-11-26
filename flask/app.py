from flask import Flask, request, jsonify
import torch
from PIL import Image
import numpy as np
import os
from torchvision import transforms
import torch.nn.functional as F
import timm
from flask_cors import CORS

# Libraries to install: pip install flask flask-cors torch timm Pillow numpy
# To run the server: python app.py

app = Flask(__name__)
CORS(app)

# Define the classes
classes = {
    'caries': 0,
    'calculus': 1,
    'gingivitis': 2,
    'toothDiscoloration': 3,
    'hypodontia': 4,
    'ulcer': 5
}

# Load the model
model_path = 'C:/Users/asf/Downloads/6disease.pth'
m = timm.create_model("rexnet_150", pretrained=True, num_classes=6)
m.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
m.eval()

# Final convolution layer and FC parameters
final_conv, fc_params = m.features[-1], list(m.head.fc.parameters())

# Preprocessing function
def preprocess_image(image, im_size=224):
    preprocess = transforms.Compose([
        transforms.Resize((im_size, im_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    image = Image.open(image).convert('RGB')
    image = preprocess(image).unsqueeze(0)  # Add batch dimension
    return image

# Class for feature extraction from final conv layer
class SaveFeatures():
    features = None
    def __init__(self, m):
        self.hook = m.register_forward_hook(self.hook_fn)
    def hook_fn(self, module, input, output):
        self.features = ((output.cpu()).data).numpy()
    def remove(self):
        self.hook.remove()

# Inference function with OOD detection and limited predictions
def inference_single_image_with_ood_detection_and_multilabel(model, image_path, final_conv, fc_params, cls_names, threshold=0.82, ood_threshold=0.9):
    im = preprocess_image(image_path)
    weight = np.squeeze(fc_params[0].cpu().data.numpy())
    activated_features = SaveFeatures(final_conv)

    with torch.no_grad():
        output = model(im)

    probabilities = torch.sigmoid(output)
    max_prob, _ = torch.max(probabilities, dim=1)
    entropy = -torch.sum(probabilities * torch.log(probabilities + 1e-10), dim=1)  # Avoid log(0)

    # Out-of-distribution detection
    if max_prob.item() < ood_threshold or entropy.item() > threshold:
        return {'predicted_classes': ['Unknown / OOD'], 'probabilities': []}

    # Multi-label classification
    pred_classes = (probabilities > threshold).float().cpu().numpy().flatten()
    predicted_classes = [(cls_names[i], probabilities[0][i].item()) for i in range(len(pred_classes)) if pred_classes[i] == 1]

    # Sort by probabilities (descending) and keep only top 2 if more than 1 exists
    predicted_classes = sorted(predicted_classes, key=lambda x: x[1], reverse=True)
    top_predictions = predicted_classes[:2]  # Limit to top 2 predictions

    if top_predictions:
        return {
            'predicted_classes': [pred[0] for pred in top_predictions],
            'probabilities': [pred[1] for pred in top_predictions]
        }
    else:
        return {'predicted_classes': ['Unknown / OOD'], 'probabilities': []}

# Flask route to accept image and return prediction
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    image = request.files['image']
    if image:
        # Perform the inference
        results = inference_single_image_with_ood_detection_and_multilabel(
            model=m,
            image_path=image,
            final_conv=final_conv,
            fc_params=fc_params,
            cls_names=list(classes.keys()),
            threshold=0.90,         # Classification threshold
            ood_threshold=0.8       # OOD detection threshold
        )
        return jsonify(results), 200
    else:
        return jsonify({'error': 'Invalid image'}), 400

if __name__ == '__main__':
    app.run(debug=True)
