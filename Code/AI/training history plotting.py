import pandas as pd
import json as json
import matplotlib.pyplot as plt

file = open("D:/UDLA/Capstone Project/Repo/Code/AI/errors_AI_model_data/training-history 10 aug mlp.json", 'r')
history = json.loads(file.read())

plt.plot(history["epoch"], history["history"]["val_acc"], label="accuracy validación")
plt.xlabel("épocas")
plt.ylabel("accuracy")
plt.legend()
plt.show()