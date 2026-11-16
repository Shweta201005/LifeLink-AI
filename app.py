from flask import Flask, jsonify, render_template_string
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

app = Flask(__name__)

# Demonstration dataset
data = {
    "day": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "stock": [50, 45, 42, 38, 35, 30, 28, 25, 20, 15],
    "demand": [10, 12, 14, 15, 18, 20, 22, 25, 28, 30]
}

df = pd.DataFrame(data)
X = df[["day", "stock", "demand"]]
y = df["stock"]

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

@app.route("/")
def home():
    return render_template_string("""
    <html>
    <head>
      <title>LifeLink AI Prediction</title>
      <style>
        body {font-family: Arial; background:#fff5f5;
              text-align:center; padding:40px;}
        .card {background:white; padding:30px;
               max-width:500px; margin:auto;
               border-radius:15px;}
        input, button {padding:12px; margin:8px;
                       width:80%;}
        button {background:#c62828; color:white;
                border:0; cursor:pointer;}
      </style>
    </head>
    <body>
      <div class="card">
        <h1>LifeLink AI</h1>
        <h2>Blood Shortage Prediction</h2>
        <input id="stock" type="number" value="15"
               placeholder="Current stock">
        <input id="demand" type="number" value="30"
               placeholder="Expected demand">
        <button onclick="predict()">Predict Shortage</button>
        <h3 id="result">Enter details and predict</h3>
      </div>
      <script>
        async function predict() {
          const stock = document.getElementById("stock").value;
          const demand = document.getElementById("demand").value;
          const response = await fetch(
            `/predict?stock=${stock}&demand=${demand}`
          );
          const data = await response.json();
          document.getElementById("result").innerText =
            data.message + " | Predicted stock: " +
            data.prediction;
        }
      </script>
    </body>
    </html>
    """)

@app.route("/predict")
def predict():
    stock = float(__import__("flask").request.args.get("stock", 15))
    demand = float(__import__("flask").request.args.get("demand", 30))

    prediction = model.predict([[11, stock, demand]])[0]
    message = "LOW INVENTORY WARNING!" if prediction < 20 else "Stock appears sufficient."

    return jsonify({
        "prediction": round(float(prediction), 2),
        "message": message
    })

if __name__ == "__main__":
    app.run(debug=True)