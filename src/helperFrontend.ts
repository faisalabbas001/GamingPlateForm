// levels.js or any utility file
export const LEVEL_THRESHOLDS = [
    { level: "Bronce", minCredits: 0, nextLevelCredits: 1000 },
    { level: "Plata", minCredits: 1000, nextLevelCredits: 5000 },
    { level: "Oro", minCredits: 5000, nextLevelCredits: 10000 },
    { level: "Platino", minCredits: 10000, nextLevelCredits: 25000 },
    { level: "Diamante", minCredits: 25000, nextLevelCredits: null },
  ];
  
  export const calculateLevelAndProgress = (credits:number) => {
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      const { level, minCredits, nextLevelCredits } = LEVEL_THRESHOLDS[i];
      
      if (credits < (nextLevelCredits || Infinity)) {
        const progress = nextLevelCredits
          ? ((credits - minCredits) / (nextLevelCredits - minCredits)) * 100
          : 100; // 100% if at top level
        
        return { level, progress: Math.min(progress, 100) };
      }
    }
    return { level: "Diamante", progress: 100 };
  };

  // this only showing information in tooltip
  export const LEVELS = [
    { name: "Bronce", range: "0-999", benefits: "Giro gratis diario" },
    {
      name: "Plata",
      range: "1,000-4,999",
      benefits: "5% de bonificación en compras",
    },
    {
      name: "Oro",
      range: "5,000-9,999",
      benefits: "10% de bonificación en compras, acceso a torneos exclusivos",
    },
    {
      name: "Platino",
      range: "10,000-24,999",
      benefits: "15% de bonificación en compras, soporte prioritario",
    },
    {
      name: "Diamante",
      range: "25,000+",
      benefits: "20% de bonificación en compras, gestor de cuenta personal",
    },
  ];
  