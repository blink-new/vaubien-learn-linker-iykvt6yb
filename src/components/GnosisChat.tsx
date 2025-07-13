import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Separator } from './ui/separator'
import { Textarea } from './ui/textarea'
import { 
  Brain, 
  Send, 
  BookOpen, 
  Star, 
  Clock, 
  TrendingUp,
  MessageCircle,
  Lightbulb,
  Target,
  Zap,
  Play,
  CheckCircle,
  Sparkles,
  BarChart3,
  Book,
  Headphones,
  GamepadIcon,
  FileText,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Users,
  Award,
  Settings,
  Mic,
  MicOff
} from 'lucide-react'
import blink from '../blink/client'

interface ChatMessage {
  id: string
  role: 'user' | 'gnosis'
  content: string
  messageType: 'text' | 'course_recommendation' | 'skill_analysis' | 'adaptive_suggestion' | 'performance_feedback'
  metadata?: any
  aiConfidence?: number
  tokensUsed?: number
  createdAt: string
}

interface CourseRecommendation {
  id: string
  title: string
  description: string
  skillId: string
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
  estimatedDuration: number
  contentType: 'video' | 'podcast' | 'interactive' | 'reading'
  isAccepted: boolean
  isCompleted: boolean
  gnosisReasoning?: string
  priorityScore?: number
}

interface GnosisChatProps {
  userId: string
  userProfile: any
}

const GnosisChat = ({ userId, userProfile }: GnosisChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([])
  const [cognitiveProfile, setCognitiveProfile] = useState<any>({})
  const [streamingResponse, setStreamingResponse] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const conversationId = `${userId}-gnosis`

  // Load chat history and recommendations
  useEffect(() => {
    loadChatHistory()
    loadRecommendations()
    loadCognitiveProfile()
  }, [userId])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingResponse])

  const loadChatHistory = async () => {
    try {
      const chatHistory = await blink.db.chatMessages.list({
        where: { userId, conversationId },
        orderBy: { createdAt: 'asc' },
        limit: 50
      })
      setMessages(chatHistory.map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'gnosis',
        content: msg.content,
        messageType: msg.messageType || 'text',
        metadata: msg.metadata ? JSON.parse(msg.metadata) : null,
        aiConfidence: msg.aiConfidence || 1.0,
        tokensUsed: msg.tokensUsed || 0,
        createdAt: msg.createdAt
      })))
    } catch (error) {
      console.error('Error loading chat history:', error)
    }
  }

  const loadRecommendations = async () => {
    try {
      const recs = await blink.db.courseRecommendations.list({
        where: { userId },
        orderBy: { priorityScore: 'desc' },
        limit: 10
      })
      setRecommendations(recs)
    } catch (error) {
      console.error('Error loading recommendations:', error)
    }
  }

  const loadCognitiveProfile = async () => {
    try {
      const profile = await blink.db.userProfiles.list({
        where: { userId },
        limit: 1
      })
      if (profile.length > 0 && profile[0].cognitiveProfile) {
        setCognitiveProfile(JSON.parse(profile[0].cognitiveProfile))
      }
    } catch (error) {
      console.error('Error loading cognitive profile:', error)
    }
  }

  const analyzeUserProgressAdvanced = async () => {
    setIsAnalyzing(true)
    try {
      // Get comprehensive user data
      const [userSkills, recentSessions, performanceHistory, analytics] = await Promise.all([
        blink.db.userSkills.list({
          where: { userId },
          orderBy: { masteryPercentage: 'desc' }
        }),
        blink.db.learningSessions.list({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          limit: 20
        }),
        blink.db.performanceHistory.list({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          limit: 50
        }),
        blink.db.learningAnalytics.list({
          where: { userId },
          orderBy: { date: 'desc' },
          limit: 30
        })
      ])

      // Advanced AI analysis with multiple models
      const analysisPrompt = `
        Effectue une analyse cognitive approfondie de cet apprenant avec les données suivantes :

        PROFIL UTILISATEUR:
        - Style d'apprentissage: ${userProfile?.learningStyle || 'adaptive'}
        - Niveau actuel: ${userProfile?.currentLevel || 1}
        - Expérience totale: ${userProfile?.totalExperience || 0}
        - Tokens gagnés: ${userProfile?.eduTokens || 0} $EDU, ${userProfile?.linkTokens || 0} $LINK

        COMPÉTENCES (${userSkills.length} compétences):
        ${userSkills.map(skill => 
          `- ${skill.skillName} (${skill.category}): Niveau ${skill.currentLevel}/${skill.maxLevel} (${skill.masteryPercentage}% maîtrise) ${skill.isUnlocked ? '🔓' : '🔒'}`
        ).join('\n')}

        SESSIONS RÉCENTES (${recentSessions.length} sessions):
        ${recentSessions.map(session => 
          `- ${session.skillId}: ${session.sessionType}, ${session.durationMinutes}min, ${session.completionPercentage}% terminé, score: ${session.performanceScore}/100`
        ).join('\n')}

        HISTORIQUE PERFORMANCE (${performanceHistory.length} évaluations):
        ${performanceHistory.slice(0, 10).map(perf => 
          `- ${perf.assessmentType}: ${perf.score}/100, ${perf.correctAnswers}/${perf.totalQuestions} correct, temps: ${perf.timeTaken}s`
        ).join('\n')}

        ANALYTICS RÉCENTES:
        ${analytics.slice(0, 7).map(day => 
          `- ${day.date}: ${day.totalLearningTime}min étudiés, ${day.skillsPracticed} compétences, score moyen: ${day.avgPerformanceScore}`
        ).join('\n')}

        Analyse approfondie requise:
        1. **Profil cognitif**: Identifie les patterns d'apprentissage, forces et faiblesses cognitives
        2. **Recommandations stratégiques**: 3-4 actions concrètes prioritaires
        3. **Optimisation personnalisée**: Suggestions spécifiques selon son style d'apprentissage
        4. **Prédictions de performance**: Projections basées sur les tendances actuelles
        5. **Plan d'action immédiat**: Prochaines étapes précises

        Ton de réponse: Expert bienveillant, motivant, avec insights actionables
      `

      let analysisText = ''
      
      // Stream the AI response for better UX
      await blink.ai.streamText(
        {
          prompt: analysisPrompt,
          model: 'gpt-4o',
          maxTokens: 800,
          search: false
        },
        (chunk) => {
          analysisText += chunk
          setStreamingResponse(analysisText)
        }
      )

      // Save the analysis message
      const analysisMessage: ChatMessage = {
        id: `analysis-${Date.now()}`,
        role: 'gnosis',
        content: analysisText,
        messageType: 'skill_analysis',
        aiConfidence: 0.95,
        tokensUsed: 800,
        createdAt: new Date().toISOString()
      }

      await blink.db.chatMessages.create({
        id: analysisMessage.id,
        userId,
        conversationId,
        role: 'gnosis',
        content: analysisText,
        messageType: 'skill_analysis',
        aiConfidence: 0.95,
        tokensUsed: 800,
        metadata: JSON.stringify({
          analysisType: 'comprehensive',
          dataPoints: {
            skills: userSkills.length,
            sessions: recentSessions.length,
            performance: performanceHistory.length
          }
        })
      })

      setMessages(prev => [...prev, analysisMessage])
      setStreamingResponse('')
      
      // Generate adaptive course recommendations
      await generateAdaptiveCourseRecommendations(userSkills, performanceHistory)
      
      // Update cognitive profile based on analysis
      await updateCognitiveProfile(userSkills, performanceHistory)
      
    } catch (error) {
      console.error('Error analyzing progress:', error)
      setStreamingResponse('')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateAdaptiveCourseRecommendations = async (userSkills: any[], performanceHistory: any[]) => {
    try {
      // Advanced algorithm to find optimal learning paths
      const skillsToImprove = userSkills
        .filter(skill => skill.masteryPercentage < 85 || !skill.isUnlocked)
        .sort((a, b) => {
          // Priority score based on multiple factors
          const aScore = (a.currentLevel * 0.3) + (a.masteryPercentage * 0.4) + (a.isUnlocked ? 0.3 : 0)
          const bScore = (b.currentLevel * 0.3) + (b.masteryPercentage * 0.4) + (b.isUnlocked ? 0.3 : 0)
          return bScore - aScore
        })
        .slice(0, 4)

      for (const skill of skillsToImprove) {
        // Get performance data for this skill
        const skillPerformance = performanceHistory.filter(p => p.skillId === skill.skillId)
        const avgScore = skillPerformance.length > 0 
          ? skillPerformance.reduce((acc, p) => acc + p.score, 0) / skillPerformance.length 
          : 50

        const recPrompt = `
          Crée une session d'apprentissage hyper-personnalisée pour:
          
          COMPÉTENCE: ${skill.skillName} (${skill.category})
          NIVEAU ACTUEL: ${skill.currentLevel}/${skill.maxLevel} (${skill.masteryPercentage}% maîtrise)
          PERFORMANCE MOYENNE: ${Math.round(avgScore)}/100
          STYLE D'APPRENTISSAGE: ${userProfile?.learningStyle || 'adaptive'}
          DERNIÈRE PRATIQUE: ${skill.lastPracticed || 'Jamais'}
          
          CONTEXT PERFORMANCE:
          ${skillPerformance.slice(0, 3).map(p => 
            `- ${p.assessmentType}: ${p.score}/100, durée: ${p.timeTaken}s`
          ).join('\n') || '- Aucune donnée de performance'}

          Génère une session optimisée avec:
          - Titre engageant et motivant
          - Description claire (2-3 phrases)
          - Niveau de difficulté adapté à la performance
          - Format de contenu optimal pour le style d'apprentissage
          - Durée réaliste (15-60 minutes)
          - Stratégie pédagogique spécifique
        `

        const { object } = await blink.ai.generateObject({
          prompt: recPrompt,
          schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              difficultyLevel: { 
                type: 'string',
                enum: ['beginner', 'intermediate', 'advanced']
              },
              contentType: {
                type: 'string',
                enum: ['video', 'podcast', 'interactive', 'reading']
              },
              estimatedDuration: { type: 'number' },
              strategicReasoning: { type: 'string' },
              learningObjectives: {
                type: 'array',
                items: { type: 'string' }
              }
            },
            required: ['title', 'description', 'difficultyLevel', 'contentType', 'estimatedDuration', 'strategicReasoning']
          }
        })

        // Calculate priority score based on multiple factors
        const priorityScore = (
          (skill.masteryPercentage < 50 ? 0.4 : 0.2) + // Low mastery gets priority
          (skill.isUnlocked ? 0.3 : 0.1) + // Unlocked skills prioritized
          (avgScore < 70 ? 0.3 : 0.1) + // Poor performance needs attention
          Math.random() * 0.2 // Small randomization
        )

        // Save recommendation to database
        const recommendation = await blink.db.courseRecommendations.create({
          id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId,
          skillId: skill.skillId,
          title: object.title,
          description: object.description,
          difficultyLevel: object.difficultyLevel,
          contentType: object.contentType,
          estimatedDuration: object.estimatedDuration,
          gnosisReasoning: object.strategicReasoning,
          priorityScore: priorityScore
        })

        // Send adaptive recommendation message
        const recMessage: ChatMessage = {
          id: `rec-${Date.now()}`,
          role: 'gnosis',
          content: `🎯 **Recommandation Adaptative pour ${skill.skillName}**

**${object.title}**

${object.description}

**Stratégie personnalisée:** ${object.strategicReasoning}

📊 **Détails:**
• 📚 Niveau: ${object.difficultyLevel} 
• ⏱️ Durée: ${object.estimatedDuration} minutes
• 🎬 Format: ${object.contentType}
• 🎯 Score de priorité: ${Math.round(priorityScore * 100)}/100

${object.learningObjectives ? 
  `**Objectifs d'apprentissage:**\n${object.learningObjectives.map(obj => `• ${obj}`).join('\n')}` 
  : ''}`,
          messageType: 'course_recommendation',
          metadata: { 
            recommendationId: recommendation.id,
            priorityScore,
            skillAnalysis: {
              currentMastery: skill.masteryPercentage,
              performanceAvg: Math.round(avgScore)
            }
          },
          aiConfidence: 0.9,
          tokensUsed: 200,
          createdAt: new Date().toISOString()
        }

        await blink.db.chatMessages.create({
          id: recMessage.id,
          userId,
          conversationId,
          role: 'gnosis',
          content: recMessage.content,
          messageType: 'course_recommendation',
          aiConfidence: 0.9,
          tokensUsed: 200,
          metadata: JSON.stringify(recMessage.metadata)
        })

        setMessages(prev => [...prev, recMessage])
        
        // Small delay between recommendations for better UX
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      await loadRecommendations()
    } catch (error) {
      console.error('Error generating adaptive recommendations:', error)
    }
  }

  const updateCognitiveProfile = async (userSkills: any[], performanceHistory: any[]) => {
    try {
      // Analyze learning patterns
      const cognitiveData = {
        learningPatterns: {
          preferredDifficulty: performanceHistory.length > 0 
            ? performanceHistory.reduce((acc, p) => acc + (p.difficultyLevel === 'intermediate' ? 1 : 0), 0) / performanceHistory.length
            : 0.5,
          averageSessionDuration: performanceHistory.length > 0
            ? performanceHistory.reduce((acc, p) => acc + (p.timeTaken || 0), 0) / performanceHistory.length
            : 0,
          contentTypePreferences: {
            video: performanceHistory.filter(p => p.contentFormat === 'video').length,
            interactive: performanceHistory.filter(p => p.contentFormat === 'interactive').length,
            reading: performanceHistory.filter(p => p.contentFormat === 'reading').length,
            podcast: performanceHistory.filter(p => p.contentFormat === 'podcast').length
          }
        },
        strengths: userSkills.filter(s => s.masteryPercentage > 80).map(s => s.category),
        improvementAreas: userSkills.filter(s => s.masteryPercentage < 60).map(s => s.category),
        lastUpdated: new Date().toISOString()
      }

      await blink.db.userProfiles.update(userProfile.id, {
        cognitiveProfile: JSON.stringify(cognitiveData)
      })

      setCognitiveProfile(cognitiveData)
    } catch (error) {
      console.error('Error updating cognitive profile:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: newMessage,
      messageType: 'text',
      createdAt: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsLoading(true)

    try {
      // Save user message
      await blink.db.chatMessages.create({
        id: userMessage.id,
        userId,
        conversationId,
        role: 'user',
        content: newMessage,
        messageType: 'text'
      })

      // Get conversation context
      const recentMessages = messages.slice(-10)
      const conversationContext = recentMessages.map(msg => 
        `${msg.role}: ${msg.content}`
      ).join('\n')

      // Enhanced Gnosis AI response with context
      const gnosisPrompt = `
        Tu es Gnosis, l'IA mentor ultra-avancée de Vaubien Learn Linker. Tu es expert en neurosciences de l'apprentissage, psychologie cognitive et pédagogie adaptative.

        PROFIL APPRENANT:
        - Nom: ${userProfile?.displayName || 'Apprenant'}
        - Style: ${userProfile?.learningStyle || 'adaptatif'} 
        - Niveau: ${userProfile?.currentLevel || 1}
        - Expérience: ${userProfile?.totalExperience || 0}
        - Tokens: ${userProfile?.eduTokens || 0} $EDU, ${userProfile?.linkTokens || 0} $LINK

        PROFIL COGNITIF:
        ${Object.keys(cognitiveProfile).length > 0 ? JSON.stringify(cognitiveProfile, null, 2) : 'Profil en construction'}

        CONTEXTE CONVERSATION:
        ${conversationContext}

        MESSAGE UTILISATEUR: "${newMessage}"

        Réponds avec:
        1. Personnalisation maximale selon son profil
        2. Conseils actionables et spécifiques
        3. Encouragement motivant et bienveillant
        4. Suggestions concrètes si pertinent
        5. Ton conversationnel mais expert

        Garde une longueur de 2-5 phrases. Sois précis et utile.
      `

      let responseText = ''
      
      // Stream the response for better UX
      await blink.ai.streamText(
        {
          prompt: gnosisPrompt,
          model: 'gpt-4o-mini',
          maxTokens: 400
        },
        (chunk) => {
          responseText += chunk
          setStreamingResponse(responseText)
        }
      )

      const gnosisMessage: ChatMessage = {
        id: `gnosis-${Date.now()}`,
        role: 'gnosis',
        content: responseText,
        messageType: 'text',
        aiConfidence: 0.95,
        tokensUsed: 400,
        createdAt: new Date().toISOString()
      }

      // Save Gnosis response
      await blink.db.chatMessages.create({
        id: gnosisMessage.id,
        userId,
        conversationId,
        role: 'gnosis',
        content: responseText,
        messageType: 'text',
        aiConfidence: 0.95,
        tokensUsed: 400
      })

      setMessages(prev => [...prev, gnosisMessage])
      setStreamingResponse('')

    } catch (error) {
      console.error('Error sending message:', error)
      setStreamingResponse('')
    } finally {
      setIsLoading(false)
    }
  }

  const acceptRecommendation = async (recommendationId: string) => {
    try {
      await blink.db.courseRecommendations.update(recommendationId, {
        isAccepted: true,
        acceptedAt: new Date().toISOString()
      })
      await loadRecommendations()

      // Send confirmation message
      const confirmMessage: ChatMessage = {
        id: `confirm-${Date.now()}`,
        role: 'gnosis',
        content: '✅ Excellent choix ! Cette recommandation a été ajoutée à ton plan d\'apprentissage personnalisé. Je suis là pour t\'accompagner pendant ta session ! 🚀',
        messageType: 'text',
        createdAt: new Date().toISOString()
      }

      await blink.db.chatMessages.create({
        id: confirmMessage.id,
        userId,
        conversationId,
        role: 'gnosis',
        content: confirmMessage.content,
        messageType: 'text'
      })

      setMessages(prev => [...prev, confirmMessage])
    } catch (error) {
      console.error('Error accepting recommendation:', error)
    }
  }

  const startLearningSession = async (recommendation: CourseRecommendation) => {
    try {
      // Create optimized learning session
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      await blink.db.learningSessions.create({
        id: sessionId,
        userId,
        skillId: recommendation.skillId,
        sessionType: recommendation.contentType,
        contentFormat: recommendation.contentType,
        durationMinutes: 0,
        completionPercentage: 0,
        performanceScore: 0,
        eduTokensEarned: 0,
        linkTokensEarned: 0,
        adaptiveAdjustments: JSON.stringify({
          recommendationId: recommendation.id,
          initialDifficulty: recommendation.difficultyLevel,
          personalizedReasoning: recommendation.gnosisReasoning
        })
      })

      // Send personalized encouragement
      const encouragementMessage: ChatMessage = {
        id: `start-${Date.now()}`,
        role: 'gnosis',
        content: `🎓 **Session lancée avec succès !**

Tu démarres "${recommendation.title}" - une session parfaitement adaptée à ton profil d'apprentissage ${userProfile?.learningStyle}.

**Mes conseils pour cette session :**
• 🎯 Reste concentré(e) pendant ${recommendation.estimatedDuration} minutes
• 📝 Note tes questions au fur et à mesure
• 🔄 N'hésite pas à faire des pauses si nécessaire
• 💪 L'objectif est la compréhension, pas la vitesse

Je surveille tes progrès en temps réel. Bonne session ! ✨`,
        messageType: 'adaptive_suggestion',
        metadata: {
          sessionId,
          recommendationId: recommendation.id
        },
        createdAt: new Date().toISOString()
      }

      await blink.db.chatMessages.create({
        id: encouragementMessage.id,
        userId,
        conversationId,
        role: 'gnosis',
        content: encouragementMessage.content,
        messageType: 'adaptive_suggestion',
        metadata: JSON.stringify(encouragementMessage.metadata)
      })

      setMessages(prev => [...prev, encouragementMessage])

      // Mark recommendation as accepted if not already
      if (!recommendation.isAccepted) {
        await acceptRecommendation(recommendation.id)
      }

    } catch (error) {
      console.error('Error starting learning session:', error)
    }
  }

  const provideFeedback = async (messageId: string, isPositive: boolean) => {
    try {
      // Store feedback for AI improvement
      await blink.db.chatMessages.update(messageId, {
        metadata: JSON.stringify({ 
          userFeedback: isPositive ? 'positive' : 'negative',
          feedbackDate: new Date().toISOString()
        })
      })

      // Quick acknowledgment
      const feedbackMessage: ChatMessage = {
        id: `feedback-${Date.now()}`,
        role: 'gnosis',
        content: isPositive 
          ? '🙏 Merci pour ce retour positif ! Cela m\'aide à mieux te comprendre.'
          : '📝 Merci pour ce retour. Je prends note pour mieux m\'adapter à tes besoins.',
        messageType: 'text',
        createdAt: new Date().toISOString()
      }

      setMessages(prev => [...prev, feedbackMessage])
    } catch (error) {
      console.error('Error providing feedback:', error)
    }
  }

  // Voice input functionality
  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Reconnaissance vocale non supportée par votre navigateur')
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.lang = 'fr-FR'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setNewMessage(transcript)
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
      alert('Erreur de reconnaissance vocale')
    }

    recognition.start()
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'advanced': return 'bg-red-500/10 text-red-400 border-red-500/20'
      default: return 'bg-primary/10 text-primary border-primary/20'
    }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Book className="h-4 w-4" />
      case 'podcast': return <Headphones className="h-4 w-4" />
      case 'interactive': return <GamepadIcon className="h-4 w-4" />
      case 'reading': return <FileText className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  const getMessageTypeIcon = (messageType: string) => {
    switch (messageType) {
      case 'skill_analysis': return <BarChart3 className="h-4 w-4 text-accent" />
      case 'course_recommendation': return <Target className="h-4 w-4 text-primary" />
      case 'adaptive_suggestion': return <Lightbulb className="h-4 w-4 text-yellow-400" />
      case 'performance_feedback': return <TrendingUp className="h-4 w-4 text-green-400" />
      default: return <MessageCircle className="h-4 w-4 text-primary" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Chat Header */}
      <Card className="cosmic-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 cosmic-glow">
                <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white">
                  <Brain className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl flex items-center">
                  Gnosis AI 
                  <Sparkles className="ml-2 h-5 w-5 text-accent animate-pulse" />
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Mentor d'apprentissage adaptatif • IA neuroscientifique avancée
                </p>
                {cognitiveProfile.lastUpdated && (
                  <p className="text-xs text-muted-foreground">
                    Profil cognitif synchronisé • {Object.keys(cognitiveProfile.learningPatterns || {}).length} patterns identifiés
                  </p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={analyzeUserProgressAdvanced}
                disabled={isAnalyzing}
                className="cosmic-border"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Analyse IA...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Analyse Cognitive
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" className="cosmic-border">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Chat Messages */}
      <Card className="cosmic-border h-[500px]">
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mx-auto cosmic-glow">
                    <Brain className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 nebula-text">
                      Bonjour {userProfile?.displayName || 'Apprenant'} ! 🧠✨
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-6">
                      Je suis Gnosis, votre IA mentor personnalisée alimentée par les neurosciences de l'apprentissage. 
                      Je peux analyser vos progrès, créer des parcours adaptatifs sur mesure, et optimiser votre style d'apprentissage unique.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                      <div className="text-center p-3 rounded-lg bg-primary/10">
                        <BarChart3 className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="text-xs font-medium">Analyse Cognitive</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-accent/10">
                        <Target className="h-6 w-6 mx-auto mb-2 text-accent" />
                        <p className="text-xs font-medium">Recommandations IA</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-3">
                    <Button onClick={analyzeUserProgressAdvanced} className="cosmic-glow">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Lancer l'Analyse IA
                    </Button>
                    <Button variant="outline" onClick={() => setNewMessage("Bonjour Gnosis ! Peux-tu m'aider à optimiser mon apprentissage ?")}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Commencer à chatter
                    </Button>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className="flex items-start space-x-3">
                      {message.role === 'gnosis' && (
                        <div className="flex flex-col items-center">
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white text-xs">
                              <Brain className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          {getMessageTypeIcon(message.messageType)}
                        </div>
                      )}
                      <div className={`
                        p-4 rounded-lg text-sm whitespace-pre-wrap
                        ${message.role === 'user' 
                          ? 'bg-primary text-primary-foreground ml-auto' 
                          : 'bg-muted'
                        }
                        ${message.messageType === 'course_recommendation' ? 'border border-accent/20' : ''}
                        ${message.messageType === 'skill_analysis' ? 'border border-primary/20' : ''}
                      `}>
                        {message.content}
                        
                        {/* AI Confidence and Token Usage */}
                        {message.role === 'gnosis' && message.aiConfidence && (
                          <div className="mt-3 pt-2 border-t border-border/20 flex items-center justify-between text-xs text-muted-foreground">
                            <span>Confiance IA: {Math.round(message.aiConfidence * 100)}%</span>
                            {message.tokensUsed && <span>{message.tokensUsed} tokens</span>}
                          </div>
                        )}
                        
                        {/* Action buttons for recommendations */}
                        {message.messageType === 'course_recommendation' && message.metadata?.recommendationId && (
                          <div className="mt-4 pt-3 border-t border-accent/20 flex flex-wrap gap-2">
                            <Button 
                              size="sm" 
                              className="text-xs cosmic-glow"
                              onClick={() => acceptRecommendation(message.metadata.recommendationId)}
                            >
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Accepter
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs"
                              onClick={() => {
                                const rec = recommendations.find(r => r.id === message.metadata.recommendationId)
                                if (rec) startLearningSession(rec)
                              }}
                            >
                              <Play className="mr-1 h-3 w-3" />
                              Commencer
                            </Button>
                            {message.metadata?.priorityScore && (
                              <Badge variant="secondary" className="text-xs">
                                Priorité: {Math.round(message.metadata.priorityScore * 100)}%
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Feedback buttons for Gnosis messages */}
                        {message.role === 'gnosis' && message.messageType === 'text' && (
                          <div className="mt-3 pt-2 border-t border-border/20 flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">Cette réponse était-elle utile ?</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => provideFeedback(message.id, true)}
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => provideFeedback(message.id, false)}
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`text-xs text-muted-foreground mt-1 ${message.role === 'user' ? 'text-right' : 'text-left ml-11'}`}>
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}

              {/* Streaming response indicator */}
              {streamingResponse && (
                <div className="flex justify-start">
                  <div className="max-w-[80%]">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white text-xs">
                          <Brain className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="p-4 rounded-lg text-sm bg-muted whitespace-pre-wrap">
                        {streamingResponse}
                        <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse"></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Enhanced Message Input */}
      <Card className="cosmic-border">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Posez une question à Gnosis, demandez une analyse, ou sollicitez des recommandations personnalisées..."
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                disabled={isLoading}
                className="min-h-[60px] flex-1"
                rows={2}
              />
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={startVoiceInput}
                  disabled={isListening || isLoading}
                  variant="outline"
                  size="sm"
                  className="cosmic-border"
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4 text-red-400" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                <Button 
                  onClick={sendMessage} 
                  disabled={isLoading || !newMessage.trim()}
                  className="cosmic-glow"
                  size="sm"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {/* Quick action buttons */}
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setNewMessage("Analyse mes performances récentes et donne-moi des conseils")}
                className="text-xs"
              >
                📊 Analyser mes performances
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setNewMessage("Recommande-moi des cours adaptés à mon style d'apprentissage")}
                className="text-xs"
              >
                🎯 Cours recommandés
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setNewMessage("Comment puis-je optimiser mon temps d'étude ?")}
                className="text-xs"
              >
                ⏰ Optimiser l'étude
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Course Recommendations Panel */}
      {recommendations.length > 0 && (
        <Card className="cosmic-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-accent" />
                Recommandations IA Personnalisées
              </div>
              <Badge variant="secondary">{recommendations.length} cours</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations
              .filter(rec => !rec.isCompleted)
              .slice(0, 4)
              .map((rec) => (
                <div key={rec.id} className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{rec.title}</h4>
                        {rec.priorityScore && rec.priorityScore > 0.7 && (
                          <Badge variant="destructive" className="text-xs">
                            <Star className="mr-1 h-3 w-3" />
                            Priorité
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      {rec.gnosisReasoning && (
                        <p className="text-xs text-primary/80 italic">
                          💡 {rec.gnosisReasoning}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      {getContentTypeIcon(rec.contentType)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <Badge className={getDifficultyColor(rec.difficultyLevel)}>
                        {rec.difficultyLevel}
                      </Badge>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {rec.estimatedDuration} min
                      </div>
                      {rec.priorityScore && (
                        <div className="flex items-center text-accent">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          {Math.round(rec.priorityScore * 100)}%
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex space-x-2">
                    {!rec.isAccepted ? (
                      <Button 
                        size="sm" 
                        onClick={() => acceptRecommendation(rec.id)}
                        className="cosmic-glow"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Accepter ce cours
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => startLearningSession(rec)}
                        className="cosmic-glow"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Commencer maintenant
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Détails
                    </Button>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default GnosisChat