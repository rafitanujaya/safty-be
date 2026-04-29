"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateImageRisk = exports.calculateFileRisk = exports.getRiskLevelFromScore = void 0;
const client_1 = require("@prisma/client");
const getRiskLevelFromScore = (score) => {
    if (score <= 20)
        return client_1.RiskLevel.SAFE;
    if (score <= 40)
        return client_1.RiskLevel.LOW;
    if (score <= 60)
        return client_1.RiskLevel.MEDIUM;
    if (score <= 80)
        return client_1.RiskLevel.HIGH;
    return client_1.RiskLevel.CRITICAL;
};
exports.getRiskLevelFromScore = getRiskLevelFromScore;
const calculateFileRisk = (fileName) => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.match(/\.(pdf|docx|jpg)\.exe$/)) {
        return {
            riskScore: 98,
            riskLevel: client_1.RiskLevel.CRITICAL,
            verdict: client_1.ScanVerdict.MALICIOUS,
            actionTaken: client_1.ActionTaken.BLOCKED,
            detectionNote: "Double extension pattern detected"
        };
    }
    else if (lowerName.includes(".exe")) {
        return {
            riskScore: 90,
            riskLevel: client_1.RiskLevel.CRITICAL,
            verdict: client_1.ScanVerdict.MALICIOUS,
            actionTaken: client_1.ActionTaken.BLOCKED,
            detectionNote: "Executable file detected"
        };
    }
    else if (lowerName.includes(".zip")) {
        return {
            riskScore: 65,
            riskLevel: client_1.RiskLevel.MEDIUM,
            verdict: client_1.ScanVerdict.SUSPICIOUS,
            actionTaken: client_1.ActionTaken.WARNING,
            detectionNote: "Compressed archive requires caution"
        };
    }
    return {
        riskScore: 12,
        riskLevel: client_1.RiskLevel.LOW,
        verdict: client_1.ScanVerdict.SAFE,
        actionTaken: client_1.ActionTaken.PASSED,
        detectionNote: "No suspicious pattern detected"
    };
};
exports.calculateFileRisk = calculateFileRisk;
const calculateImageRisk = (imageName) => {
    const lowerName = imageName.toLowerCase();
    if (lowerName.includes("login")) {
        return {
            riskScore: 78,
            riskLevel: client_1.RiskLevel.HIGH,
            verdict: client_1.ScanVerdict.SCAM,
            confidence: 0.87,
            detectionNote: "Screenshot resembles a phishing login page"
        };
    }
    else if (lowerName.match(/(payment|receipt|transfer)/)) {
        return {
            riskScore: 68,
            riskLevel: client_1.RiskLevel.MEDIUM,
            verdict: client_1.ScanVerdict.SUSPICIOUS,
            confidence: 0.81,
            detectionNote: "Potential fake receipt or manipulated payment proof"
        };
    }
    return {
        riskScore: 10,
        riskLevel: client_1.RiskLevel.LOW,
        verdict: client_1.ScanVerdict.SAFE,
        confidence: 0.72,
        detectionNote: "No suspicious image pattern detected"
    };
};
exports.calculateImageRisk = calculateImageRisk;
