import pandas as pd
import json as json
import matplotlib.pyplot as plt

file = open("D:/UDLA/Capstone Project/Repo/Code/AI/errors_AI_model_data/training-history-1000 epochs.json", 'r')
history = json.loads(file.read())

plt.plot(history["epoch"], history["history"]["val_loss"])