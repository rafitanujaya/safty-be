import { RiskLevel, ScanVerdict, ActionTaken } from "@prisma/client";

export const getRiskLevelFromScore = (score: number): RiskLevel => {
  if (score <= 20) return RiskLevel.SAFE;
  if (score <= 40) return RiskLevel.LOW;
  if (score <= 60) return RiskLevel.MEDIUM;
  if (score <= 80) return RiskLevel.HIGH;
  return RiskLevel.CRITICAL;
};

export const calculateFileRisk = (fileName: string) => {
  const lowerName = fileName.toLowerCase();
  
  if (lowerName.match(/\.(pdf|docx|jpg)\.exe$/)) {
    return {
      riskScore: 98,
      riskLevel: RiskLevel.CRITICAL,
      verdict: ScanVerdict.MALICIOUS,
      actionTaken: ActionTaken.BLOCKED,
      detectionNote: "Double extension pattern detected"
    };
  } else if (lowerName.includes(".exe")) {
    return {
      riskScore: 90,
      riskLevel: RiskLevel.CRITICAL,
      verdict: ScanVerdict.MALICIOUS,
      actionTaken: ActionTaken.BLOCKED,
      detectionNote: "Executable file detected"
    };
  } else if (lowerName.includes(".zip")) {
    return {
      riskScore: 65,
      riskLevel: RiskLevel.MEDIUM,
      verdict: ScanVerdict.SUSPICIOUS,
      actionTaken: ActionTaken.WARNING,
      detectionNote: "Compressed archive requires caution"
    };
  }
  
  return {
    riskScore: 12,
    riskLevel: RiskLevel.LOW,
    verdict: ScanVerdict.SAFE,
    actionTaken: ActionTaken.PASSED,
    detectionNote: "No suspicious pattern detected"
  };
};

export const calculateImageRisk = (imageName: string) => {
  const lowerName = imageName.toLowerCase();
  
  if (lowerName.includes("login")) {
    return {
      riskScore: 78,
      riskLevel: RiskLevel.HIGH,
      verdict: ScanVerdict.SCAM,
      confidence: 0.87,
      detectionNote: "Screenshot resembles a phishing login page"
    };
  } else if (lowerName.match(/(payment|receipt|transfer)/)) {
    return {
      riskScore: 68,
      riskLevel: RiskLevel.MEDIUM,
      verdict: ScanVerdict.SUSPICIOUS,
      confidence: 0.81,
      detectionNote: "Potential fake receipt or manipulated payment proof"
    };
  }
  
  return {
    riskScore: 10,
    riskLevel: RiskLevel.LOW,
    verdict: ScanVerdict.SAFE,
    confidence: 0.72,
    detectionNote: "No suspicious image pattern detected"
  };
};
