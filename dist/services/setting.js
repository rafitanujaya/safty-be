"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = void 0;
const prisma_js_1 = require("../db/prisma.js");
const getSettings = async (userId) => {
    let settings = await prisma_js_1.prisma.protectionSettings.findUnique({
        where: { userId },
    });
    if (!settings) {
        settings = await prisma_js_1.prisma.protectionSettings.create({
            data: { userId },
        });
    }
    return {
        realtimeProtection: settings.realtimeProtection,
        formBlocking: settings.formBlocking,
        downloadScanning: settings.downloadScanning,
        trackerBlocking: settings.trackerBlocking,
        redirectProtection: settings.redirectProtection,
        riskThreshold: settings.riskThreshold,
        themePreference: settings.themePreference,
    };
};
exports.getSettings = getSettings;
const updateSettings = async (userId, data) => {
    const { realtimeProtection, formBlocking, downloadScanning, trackerBlocking, redirectProtection, riskThreshold, themePreference, } = data;
    const updateData = {};
    if (realtimeProtection !== undefined)
        updateData.realtimeProtection = realtimeProtection;
    if (formBlocking !== undefined)
        updateData.formBlocking = formBlocking;
    if (downloadScanning !== undefined)
        updateData.downloadScanning = downloadScanning;
    if (trackerBlocking !== undefined)
        updateData.trackerBlocking = trackerBlocking;
    if (redirectProtection !== undefined)
        updateData.redirectProtection = redirectProtection;
    if (riskThreshold !== undefined)
        updateData.riskThreshold = riskThreshold;
    if (themePreference !== undefined)
        updateData.themePreference = themePreference;
    const updated = await prisma_js_1.prisma.protectionSettings.upsert({
        where: { userId },
        update: updateData,
        create: {
            userId,
            ...updateData
        }
    });
    return {
        realtimeProtection: updated.realtimeProtection,
        formBlocking: updated.formBlocking,
        downloadScanning: updated.downloadScanning,
        trackerBlocking: updated.trackerBlocking,
        redirectProtection: updated.redirectProtection,
        riskThreshold: updated.riskThreshold,
        themePreference: updated.themePreference,
    };
};
exports.updateSettings = updateSettings;
