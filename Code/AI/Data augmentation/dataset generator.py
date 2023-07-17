# -*- coding: utf-8 -*-
"""
Created on Tue Jul 11 13:42:52 2023

@author: diego
"""
import os
import json
import random

def main():
    while(True):
        opc = 0
        print("Main menu")
        print("1. Add data to dataset\t2. Exit")
        opc = int(input("Selection: "))
        if(opc==1):
            dataPath = input("Folder with JSONs: ")
            #Get all pose JSONs from the directory
            jsonDataFiles = []
            for file in os.listdir(dataPath):
                if file.endswith(".json"):
                    jsonDataFiles+=[file]
            #Ask user how much data to use for validation
            defaultValAmount = 25
            validationAmount = input("Amount of data for validation (default is 25): ")
            if(validationAmount.strip()!=""):
                validationAmount = int(validationAmount)
            else:
                validationAmount = int(defaultValAmount)
            #Get data class number (label)
            label = int(input("Class label for data (integer): "))
            #Create dataset files if they dont exist
            newJson = json.dumps([])
            datasetFiles = ["./AITrainingData.json", "./AITrainingLabels.json", "./AIValidationData.json", "./AIValidationLabels.json"]
            if(not os.path.isfile(datasetFiles[0])):
                newFile = open(datasetFiles[0], "w")
                newFile.write(newJson)
                newFile.close()
            if(not os.path.isfile(datasetFiles[1])):
                newFile = open(datasetFiles[1], "w")
                newFile.write(newJson)
                newFile.close()
            if(not os.path.isfile(datasetFiles[2])):
                newFile = open(datasetFiles[2], "w")
                newFile.write(newJson)
                newFile.close()
            if(not os.path.isfile(datasetFiles[3])):
                newFile = open(datasetFiles[3], "w")
                newFile.write(newJson)
                newFile.close()
            #Choose validation data randomly
            validationDataFiles = []
            for i in range(validationAmount):
                randFile = random.choice(jsonDataFiles)
                validationDataFiles+=[jsonDataFiles[jsonDataFiles.index(randFile)]]
                jsonDataFiles.remove(randFile)
            #Read files and append data to datasets (data and labels)
            #Training data
            trainingData = json.load(open(datasetFiles[0]))
            for dataFile in jsonDataFiles:
                trainingData += json.load(open(dataPath+dataFile))
            newData = json.dumps(trainingData)
            newFile = open(datasetFiles[0], "w")
            newFile.write(newData)
            newFile.close()
            #Training labels
            trainingLabels = json.load(open(datasetFiles[1]))
            for i in jsonDataFiles:
                trainingLabels += [label]
            newData = json.dumps(trainingLabels)
            newFile = open(datasetFiles[1], "w")
            newFile.write(newData)
            newFile.close()
            #Validation data
            validationData = json.load(open(datasetFiles[2]))
            for valDataFile in validationDataFiles:
                validationData += json.load(open(dataPath+valDataFile))
            newData = json.dumps(validationData)
            newFile = open(datasetFiles[2], "w")
            newFile.write(newData)
            newFile.close()
            #Validation labels
            validationLabels = json.load(open(datasetFiles[3]))
            for i in validationDataFiles:
                validationLabels += [label]
            newData = json.dumps(validationLabels)
            newFile = open(datasetFiles[3], "w")
            newFile.write(newData)
            newFile.close()
        if(opc==2):
            break
        if(opc!=1 and opc!=2):
            print("Invalid option")

if __name__ == "__main__":
    main()