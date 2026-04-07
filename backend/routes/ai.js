const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { OpenAI } = require("openai");
const Anthropic = require("@anthropic-ai/sdk");

// Select the dynamic AI provider
const getGeneratedText = async (prompt, provider, userApiKey) => {
  if (provider === 'ChatGPT') {
    if (!userApiKey) throw new Error("Clé OpenAI manquante");
    const openai = new OpenAI({ apiKey: userApiKey });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });
    return response.choices[0].message.content;
  }
  
  if (provider === 'Claude') {
    if (!userApiKey) throw new Error("Clé Anthropic manquante");
    const anthropic = new Anthropic({ apiKey: userApiKey });
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }]
    });
    return response.content[0].text;
  }

  // Default: Gemini (can use user key or fallback to env free key)
  const keyToUse = userApiKey || process.env.GEMINI_API_KEY;
  if (!keyToUse) throw new Error("Clé Gemini manquante");
  
  const genAI = new GoogleGenerativeAI(keyToUse);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

router.get('/stats', (req, res) => {
  res.json({
    disciplineScore: 85,
    completionRate: 92,
    focusHours: 14,
    streak: 5,
    insights: [
      { type: 'peak', text: 'Pic de productivité détecté à 09:00' },
      { type: 'streak', text: '5 jours de régularité consécutifs !' },
      { type: 'warning', text: 'Attention au retard en Philosophie' }
    ]
  });
});

router.post('/plan', async (req, res) => {
  const { goal, tasks } = req.body;
  const provider = req.headers['x-ai-provider'] || 'Gemini';
  const apiKey = req.headers['x-api-key'];
  
  try {
    const prompt = `Génère un plan d'étude optimisé pour l'objectif: "${goal}". 
    Tâches actuelles: ${tasks?.map(t => t.title).join(', ') || 'Aucune'}.
    Réponds UNIQUEMENT en JSON avec ce format: { "plan": ["étape 1", "étape 2"], "tips": "conseil court" }`;
    
    const genText = await getGeneratedText(prompt, provider, apiKey);
    const cleanJson = genText.replace(/```json|```/g, '').trim();
    return res.json(JSON.parse(cleanJson));
    
  } catch (err) {
    console.warn(`[AI Engine Fallback] ${err.message}`);
    // 2. Rule-based Fallback (No Cost, Zero Setup)
    res.json({
      plan: [
        `Session 1 (Focus): 50min sur ${tasks && tasks.length > 0 ? tasks[0].title : 'le sujet principal'}`,
        "Pause Active: 10min de marche",
        `Session 2 (Revision): 45min sur ${tasks && tasks.length > 1 ? tasks[1].title : 'la matière secondaire'}`
      ],
      tips: `Erreur avec ${provider} (Clé invalide ?). Je passe en mode manuel pour l'instant.`
    });
  }
});

module.exports = router;
