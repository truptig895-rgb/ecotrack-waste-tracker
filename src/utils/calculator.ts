import {
  ImpactResultsData,
  ImpactStatusLevel,
  TrackerInputs,
  TrackerValidationErrors,
} from '../types/tracker';

const MAX_DAILY_ITEM_LIMIT = 9999;

/**
 * Validates tracker input values with bulletproof edge-case rules:
 * - Name must be a non-empty string and cannot consist solely of whitespace.
 * - Item counts must be non-empty, non-negative whole integers (no decimals, commas, negative signs, 'e' notation, or letters).
 * - Clamps against extremely large numbers (> 9,999).
 * - If all item counts are 0, prompts user to log at least one item to prevent division by zero or NaN.
 */
export function validateTrackerInputs(inputs: TrackerInputs): TrackerValidationErrors {
  const errors: TrackerValidationErrors = {};

  // 1. Validate User Name (cannot be empty or blank spaces)
  const rawName = inputs.userName ?? '';
  const trimmedName = rawName.trim();
  if (!trimmedName) {
    errors.userName = 'Please enter your name or an identifier (cannot be blank).';
  } else if (trimmedName.length > 40) {
    errors.userName = 'Name cannot exceed 40 characters.';
  }

  // 2. Strict Integer Validator Helper
  const validateStrictInteger = (val: string | undefined | null, fieldLabel: string): string | undefined => {
    if (val === undefined || val === null || val.trim() === '') {
      return `Please enter an item count for ${fieldLabel} (enter 0 if none).`;
    }

    const cleanVal = val.trim();

    // Check for scientific notation 'e' or 'E'
    if (/[eE]/.test(cleanVal)) {
      return `${fieldLabel} cannot use scientific notation ('e').`;
    }

    // Check for decimal point or comma explicitly
    if (cleanVal.includes('.') || cleanVal.includes(',')) {
      return `${fieldLabel} must be a whole integer (decimals are not permitted).`;
    }

    // Check for negative symbol or plus symbol
    if (cleanVal.includes('-')) {
      return `${fieldLabel} cannot be negative. Must be 0 or greater.`;
    }

    // Check that all characters are digits only
    if (!/^\d+$/.test(cleanVal)) {
      return `${fieldLabel} must contain only whole numeric digits.`;
    }

    const num = Number(cleanVal);
    if (!Number.isSafeInteger(num) || isNaN(num)) {
      return `Invalid numeric value for ${fieldLabel}.`;
    }

    if (num < 0) {
      return `${fieldLabel} cannot be negative.`;
    }

    if (num > MAX_DAILY_ITEM_LIMIT) {
      return `${fieldLabel} exceeds maximum daily limit of ${MAX_DAILY_ITEM_LIMIT.toLocaleString()} items.`;
    }

    return undefined;
  };

  const plasticErr = validateStrictInteger(inputs.plasticItems, 'plastic items');
  if (plasticErr) errors.plasticItems = plasticErr;

  const paperErr = validateStrictInteger(inputs.paperItems, 'paper items');
  if (paperErr) errors.paperItems = paperErr;

  const reusableErr = validateStrictInteger(inputs.reusableItems, 'reusable items');
  if (reusableErr) errors.reusableItems = reusableErr;

  // 3. Prevent All-Zero Division-by-Zero Edge Case
  if (!errors.plasticItems && !errors.paperItems && !errors.reusableItems) {
    const p = parseInt(inputs.plasticItems.trim(), 10) || 0;
    const pa = parseInt(inputs.paperItems.trim(), 10) || 0;
    const r = parseInt(inputs.reusableItems.trim(), 10) || 0;

    if (p === 0 && pa === 0 && r === 0) {
      errors.general =
        'All items are set to 0. Please log at least one item (plastic, paper, or reusable) to calculate your environmental footprint.';
    }
  }

  return errors;
}

/**
 * Computes all environmental metrics, breakdown percentages, and adaptive status.
 * All percentages and scores are strictly clamped between 0 and 100 with zero NaN/Infinity risks.
 */
export function calculateImpact(inputs: TrackerInputs): ImpactResultsData {
  const plasticCount = Math.max(
    0,
    Math.min(MAX_DAILY_ITEM_LIMIT, parseInt((inputs.plasticItems || '0').trim(), 10) || 0)
  );
  const paperCount = Math.max(
    0,
    Math.min(MAX_DAILY_ITEM_LIMIT, parseInt((inputs.paperItems || '0').trim(), 10) || 0)
  );
  const reusableCount = Math.max(
    0,
    Math.min(MAX_DAILY_ITEM_LIMIT, parseInt((inputs.reusableItems || '0').trim(), 10) || 0)
  );
  const totalItems = plasticCount + paperCount + reusableCount;

  // Safeguard against division by zero: if totalItems is 0, clamp to 0
  let plasticPercentage = 0;
  let paperPercentage = 0;
  let reusableRatio = 0;
  let sustainabilityScore = 0;

  if (totalItems > 0) {
    plasticPercentage = Math.max(
      0,
      Math.min(100, Math.round((plasticCount / totalItems) * 1000) / 10)
    );
    paperPercentage = Math.max(
      0,
      Math.min(100, Math.round((paperCount / totalItems) * 1000) / 10)
    );
    reusableRatio = Math.max(
      0,
      Math.min(100, Math.round((reusableCount / totalItems) * 1000) / 10)
    );

    // Sustainability score (0 to 100):
    // Reusable = 100 pts, Paper = 30 pts, Plastic = 0 pts
    const rawScore = (reusableCount * 100 + paperCount * 30 + plasticCount * 0) / totalItems;
    sustainabilityScore = Math.max(0, Math.min(100, Math.round(rawScore)));
  }

  // Adaptive Environmental Impact Status
  let statusLevel: ImpactStatusLevel = 'moderate';
  let statusTitle = 'Moderate Footprint';
  let statusMessage = '';

  const userName = (inputs.userName || '').trim() || 'Eco Tracker';

  if (reusableRatio >= 60 && plasticPercentage <= 15) {
    statusLevel = 'champion';
    statusTitle = 'Eco Champion';
    statusMessage = `Outstanding effort, ${userName}! Your daily consumption is overwhelmingly sustainable. By maintaining a ${reusableRatio}% reusable ratio, you are actively preventing non-biodegradable waste from entering landfills and ocean waterways.`;
  } else if (reusableRatio >= 40 && plasticPercentage <= 35) {
    statusLevel = 'conscious';
    statusTitle = 'Conscious Conserver';
    statusMessage = `Well done, ${userName}! Your sustainable choices outnumber single-use plastics. You are building durable low-waste habits. Replacing just 1 or 2 remaining disposable paper or plastic items will put you in champion territory.`;
  } else if (plasticPercentage <= 50) {
    statusLevel = 'moderate';
    statusTitle = 'Moderate Footprint';
    statusMessage = `Good awareness, ${userName}. While you utilize reusable items, single-use disposables still make up ${Math.round(100 - reusableRatio)}% of your day. Swapping packaged drinks or takeaway packaging will significantly reduce your footprint.`;
  } else {
    statusLevel = 'high_waste';
    statusTitle = 'High Waste Alert';
    statusMessage = `Attention required, ${userName}. Single-use plastic represents ${plasticPercentage}% of your total items today. Plastics persist in the environment for centuries. Explore the recommended quick swaps below to build your eco resilience!`;
  }

  // Environmental equivalency estimates:
  // Plastic: ~22g per item, ~82g CO2e per item
  // Paper: ~16g per item, ~24g CO2e per item
  const estimatedLandfillGrams = Math.max(0, plasticCount * 22 + paperCount * 16);
  const estimatedCarbonGrams = Math.max(0, plasticCount * 82 + paperCount * 24);
  const itemsDiverted = Math.max(0, reusableCount);

  return {
    userName,
    totalItems,
    plasticCount,
    paperCount,
    reusableCount,
    plasticPercentage,
    paperPercentage,
    reusableRatio,
    sustainabilityScore,
    statusLevel,
    statusTitle,
    statusMessage,
    estimatedCarbonGrams,
    estimatedLandfillGrams,
    itemsDiverted,
    calculatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}
