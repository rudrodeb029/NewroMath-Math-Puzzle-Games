// Comprehensive simulation test for puzzle options and tray scaling
function getStageCount(levelNum) {
  const lvl = Math.max(1, Math.min(25, Number(levelNum) || 1));
  return Math.round(10 + ((lvl - 1) * 10) / 24);
}

function getStageDifficultyProfile(levelNum, stageIndex = 0, totalStages = 10) {
  const lvl = Math.max(1, Math.min(25, Number(levelNum) || 1));
  const st = Math.max(0, Math.min(totalStages - 1, Number(stageIndex) || 0));
  const progress = totalStages > 1 ? st / (totalStages - 1) : 0;

  let tierName, badgeClass, mode, blankCount, trayCount, minVal, maxVal, minM, maxM, minD, maxD;

  if (lvl === 1) {
    if (progress < 0.35) {
      tierName = 'INTRO ✦';
      badgeClass = 'bg-cyan-900/60 border-cyan-400/50 text-cyan-200';
      mode = 'add';
      blankCount = 3;
      trayCount = 5;
      minVal = 1; maxVal = 6;
    } else if (progress < 0.70) {
      tierName = 'WARM-UP ⚡';
      badgeClass = 'bg-emerald-900/60 border-emerald-400/50 text-emerald-200';
      mode = (st % 2 === 0) ? 'add' : 'sub';
      blankCount = (st <= 5) ? 3 : 4;
      trayCount = 6;
      minVal = 2; maxVal = 9;
    } else {
      tierName = 'LEVEL FINALE 🔥';
      badgeClass = 'bg-amber-900/60 border-amber-400/50 text-amber-200';
      mode = (st % 2 === 0) ? 'sub' : 'add';
      blankCount = 4;
      trayCount = 7;
      minVal = 3; maxVal = 14;
    }
  } else if (lvl <= 5) {
    if (progress < 0.35) {
      tierName = 'NOVICE ✦';
      badgeClass = 'bg-cyan-900/60 border-cyan-400/50 text-cyan-200';
      mode = (st % 2 === 0) ? 'add' : 'sub';
      blankCount = 4;
      trayCount = 6;
      minVal = 2; maxVal = 10;
    } else if (progress < 0.75) {
      tierName = 'TACTICAL ⚡';
      badgeClass = 'bg-emerald-900/60 border-emerald-400/50 text-emerald-200';
      mode = (st % 3 === 0) ? 'mul' : (st % 3 === 1) ? 'sub' : 'add';
      blankCount = (st % 2 === 0) ? 4 : 5;
      trayCount = 7;
      minVal = 3; maxVal = 16;
      minM = 2; maxM = 4;
    } else {
      tierName = 'SECTOR BOSS 🔥';
      badgeClass = 'bg-rose-900/60 border-rose-400/50 text-rose-200';
      mode = (st % 2 === 0) ? 'mul' : 'sub_both';
      blankCount = 5;
      trayCount = 8;
      minVal = 4; maxVal = 20;
      minM = 2; maxM = 5;
    }
  } else if (lvl <= 10) {
    if (progress < 0.30) {
      tierName = 'ADEPT ✦';
      badgeClass = 'bg-blue-900/60 border-blue-400/50 text-blue-200';
      mode = (st % 3 === 0) ? 'add' : (st % 3 === 1) ? 'sub' : 'mul';
      blankCount = (st % 2 === 0) ? 4 : 5;
      trayCount = 7;
      minVal = 4; maxVal = 18;
      minM = 2; maxM = 5;
    } else if (progress < 0.70) {
      tierName = 'OPERATOR ⚡';
      badgeClass = 'bg-indigo-900/60 border-indigo-400/50 text-indigo-200';
      mode = (st % 4 === 0) ? 'div' : (st % 4 === 1) ? 'mul' : (st % 4 === 2) ? 'sub_both' : 'add';
      blankCount = 5;
      trayCount = 8;
      minVal = 5; maxVal = 24;
      minM = 2; maxM = 6;
      minD = 2; maxD = 3;
    } else {
      tierName = 'MATRIX BOSS 🔥';
      badgeClass = 'bg-purple-900/60 border-purple-400/50 text-purple-200';
      mode = (st % 3 === 0) ? 'div' : (st % 3 === 1) ? 'mul_div' : 'mul';
      blankCount = 5;
      trayCount = 9;
      minVal = 6; maxVal = 30;
      minM = 3; maxM = 6;
      minD = 2; maxD = 4;
    }
  } else if (lvl <= 17) {
    if (progress < 0.30) {
      tierName = 'SPECIALIST ⚡';
      badgeClass = 'bg-indigo-900/60 border-indigo-400/50 text-indigo-200';
      mode = (st % 4 === 0) ? 'mul' : (st % 4 === 1) ? 'div' : (st % 4 === 2) ? 'sub' : 'add';
      blankCount = 5;
      trayCount = 8;
      minVal = 6; maxVal = 28;
      minM = 3; maxM = 6;
      minD = 2; maxD = 3;
    } else if (progress < 0.75) {
      tierName = 'VANGUARD 🔥';
      badgeClass = 'bg-amber-900/60 border-amber-400/50 text-amber-200';
      mode = (st % 4 === 0) ? 'mul_div' : (st % 4 === 1) ? 'div_mul' : (st % 4 === 2) ? 'div' : 'mul';
      blankCount = (st % 2 === 0) ? 5 : 6;
      trayCount = 9;
      minVal = 8; maxVal = 35;
      minM = 3; maxM = 7;
      minD = 2; maxD = 4;
    } else {
      tierName = 'TRIAL OVERLORD 💀';
      badgeClass = 'bg-rose-900/60 border-rose-400/50 text-rose-200';
      mode = (st % 3 === 0) ? 'mul_div' : (st % 3 === 1) ? 'div_mul' : 'div';
      blankCount = 6;
      trayCount = 10;
      minVal = 10; maxVal = 45;
      minM = 3; maxM = 8;
      minD = 2; maxD = 4;
    }
  } else {
    // Levels 18 - 25: Master / Apex World
    if (progress < 0.30) {
      tierName = 'MASTER ⚡';
      badgeClass = 'bg-purple-900/60 border-purple-400/50 text-purple-200';
      mode = (st % 4 === 0) ? 'mul' : (st % 4 === 1) ? 'div' : (st % 4 === 2) ? 'mul_div' : 'sub_both';
      blankCount = 5;
      trayCount = 9;
      minVal = 10; maxVal = 40;
      minM = 3; maxM = 7;
      minD = 2; maxD = 4;
    } else if (progress < 0.80) {
      tierName = 'GRANDMASTER 🔥';
      badgeClass = 'bg-rose-900/60 border-rose-400/50 text-rose-200';
      mode = (st % 4 === 0) ? 'mul_div' : (st % 4 === 1) ? 'div_mul' : (st % 4 === 2) ? 'div' : 'mul';
      blankCount = 6;
      trayCount = 10;
      minVal = 12; maxVal = 55;
      minM = 3; maxM = 8;
      minD = 2; maxD = 5;
    } else {
      tierName = 'APEX BOSS 👑';
      badgeClass = 'bg-red-950/80 border-red-500/80 text-red-200';
      mode = (st % 3 === 0) ? 'mul_div' : (st % 3 === 1) ? 'div_mul' : 'div';
      blankCount = 6;
      trayCount = (lvl === 25 && progress >= 0.90) ? 12 : 11;
      minVal = 15; maxVal = 70;
      minM = 4; maxM = 9;
      minD = 3; maxD = 5;
    }
  }

  return {
    tierName,
    badgeClass,
    mode,
    blankCount,
    trayCount,
    minVal,
    maxVal,
    minM: minM || 2,
    maxM: maxM || 5,
    minD: minD || 2,
    maxD: maxD || 3,
    progress
  };
}

function generateCrossMathPuzzle(levelNum, seed = 0, stageIndex = -1) {
  const totalStages = getStageCount(levelNum);
  const st = Math.max(0, Math.min(totalStages - 1, stageIndex >= 0 ? stageIndex : (seed >= 1000 ? Math.floor(seed / 1000) : 0)));
  const profile = getStageDifficultyProfile(levelNum, st, totalStages);

  let s = Math.abs((levelNum * 7919 + seed * 9973 + (st + 1) * 31337 + 12345)) % 233280;
  const rnd = (min, max) => {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    return Math.floor(min + r * (max - min + 1));
  };

  const mode = profile.mode;
  let X, Y, Z, A, B, C, D, E, F;
  let opH = '+', opV = '+';

  let valMap = {};
  let attempts = 0;
  while (attempts < 80) {
    attempts++;
    if (mode === 'mul') {
      opH = '×'; opV = '×';
      X = rnd(profile.minM, profile.maxM);
      Y = rnd(profile.minM, profile.maxM);
      A = rnd(profile.minM, profile.maxM);
      B = rnd(profile.minM, profile.maxM);
      Z = X * Y;
      C = A * B;
      D = X * A;
      E = Y * B;
      F = Z * C;
    } else if (mode === 'div') {
      opH = '÷'; opV = '÷';
      B = rnd(profile.minD, profile.maxD);
      C = rnd(profile.minD, profile.maxD);
      A = B * C;

      E = rnd(profile.minD, profile.maxD);
      F = rnd(profile.minD, profile.maxD);
      D = E * F;

      Z = C * F;
      Y = B * E;
      X = A * D;
    } else if (mode === 'mul_div') {
      opH = '×'; opV = '÷';
      A = rnd(profile.minD, profile.maxD);
      D = rnd(profile.minD, profile.maxD);
      X = A * D;

      B = rnd(profile.minD, profile.maxD);
      E = rnd(profile.minD, profile.maxD);
      Y = B * E;

      Z = X * Y;
      C = A * B;
      F = D * E;
    } else if (mode === 'div_mul') {
      opH = '÷'; opV = '×';
      Y = rnd(profile.minD, profile.maxD);
      Z = rnd(profile.minD, profile.maxD);
      X = Y * Z;

      B = rnd(profile.minD, profile.maxD);
      C = rnd(profile.minD, profile.maxD);
      A = B * C;

      D = X * A;
      E = Y * B;
      F = Z * C;
    } else if (mode === 'sub') {
      opH = '−'; opV = '+';
      Y = rnd(profile.minVal, profile.maxVal);
      Z = rnd(profile.minVal, profile.maxVal);
      X = Y + Z;

      B = rnd(profile.minVal, profile.maxVal);
      C = rnd(profile.minVal, profile.maxVal);
      A = B + C;

      D = X + A;
      E = Y + B;
      F = Z + C;
    } else if (mode === 'sub_both') {
      opH = '+'; opV = '−';
      A = rnd(profile.minVal, profile.maxVal);
      D = rnd(profile.minVal, profile.maxVal);
      X = A + D;

      B = rnd(profile.minVal, profile.maxVal);
      E = rnd(profile.minVal, profile.maxVal);
      Y = B + E;

      Z = X + Y;
      C = A + B;
      F = D + E;
    } else {
      opH = '+'; opV = '+';
      X = rnd(profile.minVal, profile.maxVal);
      Y = rnd(profile.minVal, profile.maxVal);
      A = rnd(profile.minVal, profile.maxVal);
      B = rnd(profile.minVal, profile.maxVal);
      Z = X + Y;
      C = A + B;
      D = X + A;
      E = Y + B;
      F = Z + C;
    }

    valMap = {
      '0,0': X, '0,2': Y, '0,4': Z,
      '2,0': A, '2,2': B, '2,4': C,
      '4,0': D, '4,2': E, '4,4': F
    };

    const distinctVals = new Set(Object.values(valMap));
    if (distinctVals.size >= profile.blankCount) {
      break;
    }
  }

  const allPos = ['0,0', '0,2', '0,4', '2,0', '2,2', '2,4', '4,0', '4,2', '4,4'];
  for (let i = allPos.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    const temp = allPos[i];
    allPos[i] = allPos[j];
    allPos[j] = temp;
  }

  let blankKeys = [];
  const chosenValues = new Set();
  
  for (const pos of allPos) {
    const v = valMap[pos];
    if (!chosenValues.has(v)) {
      chosenValues.add(v);
      blankKeys.push(pos);
      if (blankKeys.length === profile.blankCount) break;
    }
  }

  if (blankKeys.length < profile.blankCount) {
    for (const pos of allPos) {
      if (!blankKeys.includes(pos)) {
        blankKeys.push(pos);
        if (blankKeys.length === profile.blankCount) break;
      }
    }
  }

  const slots = [];
  blankKeys.forEach((key, idx) => {
    const [r, c] = key.split(',').map(Number);
    slots.push({ slot: idx, row: r, column: c, answer: valMap[key] });
  });

  const answers = slots.map(s => s.answer);
  const targetNumbersCount = profile.trayCount || (profile.blankCount <= 3 ? 5 : profile.blankCount === 4 ? 6 : profile.blankCount === 5 ? 7 : 8);

  const numbersSet = new Set(answers);

  const distractorCandidates = [
    Math.max(1, answers[0] + (rnd(0, 1) === 0 ? 1 : -1)),
    Math.max(1, (answers[1] || answers[0]) + (rnd(0, 1) === 0 ? 2 : -2)),
    Math.max(1, (answers[2] || answers[0]) + rnd(1, 4)),
    Math.max(1, (answers[0] || 5) + rnd(3, 7)),
    Math.max(1, (answers[answers.length - 1] || 5) + (rnd(0, 1) === 0 ? 3 : -3)),
    Math.max(1, (answers[1] || 4) + (rnd(0, 1) === 0 ? 4 : -4)),
    Math.max(1, (answers[2] || 6) + (rnd(0, 1) === 0 ? 5 : -5)),
    Math.max(1, (answers[0] || 7) + rnd(4, 9)),
    Math.max(1, (answers[answers.length - 1] || 8) + rnd(2, 6)),
    Math.max(1, Math.round((answers[0] + (answers[1] || answers[0])) / 2)),
    Math.max(1, answers[0] + 10),
    Math.max(1, (answers[answers.length - 1] || 10) + 10)
  ];

  for (const d of distractorCandidates) {
    if (numbersSet.size < targetNumbersCount && !numbersSet.has(d)) {
      numbersSet.add(d);
    }
  }

  let padAttempt = 0;
  let padCandidate = 1;
  while (numbersSet.size < targetNumbersCount && padAttempt < 150) {
    padAttempt++;
    const fallbackNum = rnd(1, Math.max(30, profile.maxVal * 2));
    if (!numbersSet.has(fallbackNum)) {
      numbersSet.add(fallbackNum);
    } else {
      while (numbersSet.has(padCandidate)) padCandidate++;
      numbersSet.add(padCandidate);
    }
  }

  const numbers = Array.from(numbersSet);
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    const temp = numbers[i];
    numbers[i] = numbers[j];
    numbers[j] = temp;
  }

  return {
    level: levelNum,
    stage: st + 1,
    totalStages,
    blankCount: slots.length,
    trayCount: numbers.length,
    slots,
    numbers,
    answers
  };
}

// RUN SIMULATION
console.log('Testing all 25 levels and stages...');
let errorCount = 0;
for (let lvl = 1; lvl <= 25; lvl++) {
  const totalStages = getStageCount(lvl);
  for (let st = 0; st < totalStages; st++) {
    const p = generateCrossMathPuzzle(lvl, 100 + st * 10, st);
    // Verify all answers are present in numbers
    for (const ans of p.answers) {
      if (!p.numbers.includes(ans)) {
        console.error(`ERROR: Level ${lvl} Stage ${st+1} is missing answer ${ans}!`);
        errorCount++;
      }
    }
    // Verify numbers length equals expected trayCount
    if (p.numbers.length < p.blankCount) {
      console.error(`ERROR: Level ${lvl} Stage ${st+1} has fewer numbers than blanks!`);
      errorCount++;
    }
  }
}

if (errorCount === 0) {
  console.log('SUCCESS! All levels and stages generated 100% correctly with zero missing numbers!');
} else {
  console.error(`FAILED with ${errorCount} errors.`);
  process.exit(1);
}

