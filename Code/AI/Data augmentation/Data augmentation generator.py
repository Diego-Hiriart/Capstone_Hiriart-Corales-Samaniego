# -*- coding: utf-8 -*-
"""
Created on Tue Jul 11 13:42:36 2023

@author: diego
"""

import os
import random
import json

def main():
    while(True):
        opc=0
        print("Main Menu")
        print("1. Generate data from JSONs\t2. Exit")
        opc = int(input("Select option: "))
        if(opc==1):
            dataPath = input("Folder with original data: ")
            #Get all pose JSONs from the directory and use them to generate data
            jsonDataFiles = []
            for file in os.listdir(dataPath):
                if file.endswith(".json"):
                    jsonDataFiles+=[file]
            #Ask user how much new data to generate
            generatedDataAmount = int(input("Amount of new data to generate: "))
            #Randomly choose a file to copy and modify
            for i in range(generatedDataAmount):
                filePath = random.choice(jsonDataFiles)
                newData = json.load(open(dataPath+filePath))
                #For each pose, for each keypoint, add a random number between -0.025 and 0.025 to each coordinate (-2.5 to 2.5 cm)
                for pose in newData[0]:
                    for keypoint in pose:
                        keypoint["x"] += random.uniform(-0.025, 0.025)
                        keypoint["y"] += random.uniform(-0.025, 0.025)
                        keypoint["z"] += random.uniform(-0.025, 0.025)
                newJson = json.dumps(newData)
                newFile = open(dataPath+"augmented {0}_".format(i+1)+filePath, "w")
                newFile.write(newJson)
                newFile.close()
        if(opc==2):
            break
        if(opc!=1 and opc!=2):
            print("Invalid option")

if  __name__ == "__main__":
    main()