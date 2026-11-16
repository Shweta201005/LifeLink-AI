import pandas as pd
from sklearn.ensemble import RandomForestRegressor

# Sample blood inventory data for demonstration
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

def predict_shortage(day, stock, demand):
    prediction = model.predict([[day, stock, demand]])[0]

    print("\n--- LifeLink AI Blood Prediction ---")
    print("Current Stock:", stock)
    print("Expected Stock:", round(prediction, 2))

    if prediction < 20:
        print("WARNING: Low blood inventory!")
    else:
        print("Blood inventory is sufficient.")

if __name__ == "__main__":
    predict_shortage(11, 15, 30)