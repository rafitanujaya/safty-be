import { ActionTaken, RiskLevel, ThreatEventType } from "@prisma/client";
import { prisma } from "../db/prisma";

const suspiciousKeywords = [
  "login",
  "verify",
  "secure",
  "account",
  "password",
  "otp",
  "hadiah",
  "gratis",
  "bank",
  "wallet",
  "claim",
  "reward",
];

const shortlinkDomains = ["bit.ly", "tinyurl.com", "s.id", "t.co", "goo.gl"];

function getDomainFromUrl(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function analyzeUrl(url: string) {
  const normalizedUrl = url.toLowerCase();
  const domain = getDomainFromUrl(url);

  let riskScore = 0;
  const reasons: string[] = [];

  for (const keyword of suspiciousKeywords) {
    if (normalizedUrl.includes(keyword)) {
      riskScore += 12;
      reasons.push(`Contains suspicious keyword: ${keyword}`);
    }
  }

  if (domain && shortlinkDomains.includes(domain)) {
    riskScore += 30;
    reasons.push("URL uses a known shortlink domain");
  }

  if (domain && domain.split(".").length > 3) {
    riskScore += 10;
    reasons.push("Domain uses multiple subdomains");
  }

  if (!url.startsWith("https://")) {
    riskScore += 10;
    reasons.push("URL does not use HTTPS");
  }

  if (riskScore > 100) {
    riskScore = 100;
  }

  let riskLevel: RiskLevel = "LOW";
  let result: "SAFE" | "SUSPICIOUS" | "DANGEROUS" = "SAFE";
  let actionTaken: ActionTaken = "ALLOWED";
  let eventType: ThreatEventType = "WARNING_SHOWN";
  let title = "URL appears safe";

  if (riskScore >= 70) {
    riskLevel = "HIGH";
    result = "DANGEROUS";
    actionTaken = "BLOCKED";
    eventType = "PHISHING_DETECTED";
    title = "Blocked suspicious URL";
  } else if (riskScore >= 35) {
    riskLevel = "MEDIUM";
    result = "SUSPICIOUS";
    actionTaken = "WARNED";
    eventType =
      domain && shortlinkDomains.includes(domain)
        ? "SHORTLINK_EXPANDED"
        : "WARNING_SHOWN";
    title = "Suspicious URL warning shown";
  }

  return {
    domain,
    riskScore,
    riskLevel,
    result,
    actionTaken,
    eventType,
    title,
    reasons,
  };
}

const scanUrlForUser = async (userId: string, url: string) => {
  const analysis = analyzeUrl(url);

  const event = await prisma.threatEvent.create({
    data: {
      userId,
      eventType: analysis.eventType,
      title: analysis.title,
      description: `URL scan result: ${analysis.result}`,
      riskLevel: analysis.riskLevel,
      riskScore: analysis.riskScore,
      reason: analysis.reasons.join(", ") || "No suspicious indicator found",
      sourceUrl: url,
      domain: analysis.domain,
      actionTaken: analysis.actionTaken,
    },
  });

  return {
    url,
    domain: analysis.domain,
    result: analysis.result,
    riskScore: analysis.riskScore,
    riskLevel: analysis.riskLevel,
    reasons: analysis.reasons,
    actionTaken: analysis.actionTaken,
    event,
  };
};

export { scanUrlForUser };
