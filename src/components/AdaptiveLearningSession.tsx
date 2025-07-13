import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { 
  Brain, 
  Clock, 
  Target, 
  CheckCircle, 
  AlertCircle,
  Pause,
  Play,
  SkipForward,
  RotateCcw,
  TrendingUp,
  Zap,
  Star,
  Lightbulb,
  Eye,
  Ear,
  Hand,
  BookOpen,
  Headphones,
  GamepadIcon,
  FileText,
  Timer,
  Activity,
  Award,
  Sparkles
} from 'lucide-react'
import blink from '../blink/client'

interface AdaptiveLearningSessionProps {
  userId: string
  recommendationId: string
  skillId: string
  initialDifficulty: string
  contentType: string
  estimatedDuration: number
  onSessionComplete: (results: any) => void
  onSessionPause?: () => void
}

interface SessionState {
  isActive: boolean
  isPaused: boolean
  currentStep: number
  totalSteps: number
  timeElapsed: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  cognitiveLoad: number
  performance: number
  adaptations: string[]
  tokensEarned: number
}

interface LearningContent {
  id: string
  type: 'explanation' | 'exercise' | 'quiz' | 'reflection'
  title: string
  content: string
  difficulty: string
  timeEstimate: number
  cognitiveLoad: number
  adaptiveHints?: string[]
}

const AdaptiveLearningSession = ({
  userId,
  recommendationId,
  skillId,
  initialDifficulty,
  contentType,
  estimatedDuration,
  onSessionComplete,
  onSessionPause
}: AdaptiveLearningSessionProps) => {
  const [sessionState, setSessionState] = useState<SessionState>({
    isActive: false,
    isPaused: false,
    currentStep: 0,
    totalSteps: 5,
    timeElapsed: 0,
    difficulty: initialDifficulty as 'beginner' | 'intermediate' | 'advanced',
    cognitiveLoad: 0.5,
    performance: 0,
    adaptations: [],
    tokensEarned: 0
  })

  const [learningContent, setLearningContent] = useState<LearningContent[]>([])
  const [currentContent, setCurrentContent] = useState<LearningContent | null>(null)
  const [userResponses, setUserResponses] = useState<any[]>([])
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    focusScore: 1.0,
    comprehensionRate: 0.5,
    engagementLevel: 0.8,
    learningVelocity: 1.0
  })

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const sessionStartTime = useRef<number>(0)
  const stepStartTime = useRef<number>(0)

  useEffect(() => {
    generateAdaptiveContent()
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (sessionState.isActive && !sessionState.isPaused) {
      timerRef.current = setInterval(() => {
        setSessionState(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1
        }))
        
        // Update real-time metrics every 10 seconds
        if (sessionState.timeElapsed % 10 === 0) {
          updateRealTimeMetrics()
        }
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [sessionState.isActive, sessionState.isPaused])

  const generateAdaptiveContent = async () => {
    try {
      // Generate personalized learning content using AI
      const contentPrompt = `
        Génère une session d'apprentissage adaptative pour:
        - Compétence: ${skillId}
        - Difficulté: ${initialDifficulty}
        - Type de contenu: ${contentType}
        - Durée estimée: ${estimatedDuration} minutes
        
        Crée 5 étapes progressives d'apprentissage:
        1. Introduction/Explication
        2. Démonstration pratique
        3. Exercice guidé
        4. Quiz d'évaluation
        5. Réflexion et synthèse
        
        Chaque étape doit être adaptative avec:
        - Estimation de temps réaliste
        - Charge cognitive calibrée
        - Options de personnalisation
        - Mécanismes d'ajustement temps réel
      `

      const { object } = await blink.ai.generateObject({
        prompt: contentPrompt,
        schema: {
          type: 'object',
          properties: {
            sessionTitle: { type: 'string' },
            learningObjectives: {
              type: 'array',
              items: { type: 'string' }
            },
            steps: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  type: { 
                    type: 'string',
                    enum: ['explanation', 'exercise', 'quiz', 'reflection']
                  },
                  title: { type: 'string' },
                  content: { type: 'string' },
                  timeEstimate: { type: 'number' },
                  cognitiveLoad: { type: 'number' },
                  adaptiveHints: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                }
              }
            }
          },
          required: ['sessionTitle', 'learningObjectives', 'steps']
        }
      })

      const content: LearningContent[] = object.steps.map((step, index) => ({
        id: `step-${index}`,
        type: step.type as 'explanation' | 'exercise' | 'quiz' | 'reflection',
        title: step.title,
        content: step.content,
        difficulty: sessionState.difficulty,
        timeEstimate: step.timeEstimate,
        cognitiveLoad: step.cognitiveLoad,
        adaptiveHints: step.adaptiveHints
      }))

      setLearningContent(content)
      setCurrentContent(content[0])
      setSessionState(prev => ({
        ...prev,
        totalSteps: content.length
      }))

    } catch (error) {
      console.error('Error generating adaptive content:', error)
    }
  }

  const startSession = async () => {
    sessionStartTime.current = Date.now()
    stepStartTime.current = Date.now()
    
    setSessionState(prev => ({
      ...prev,
      isActive: true,
      isPaused: false
    }))

    // Save session start to database
    await blink.db.learningSessions.create({
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      skillId,
      sessionType: contentType,
      contentFormat: contentType,
      durationMinutes: 0,
      completionPercentage: 0,
      performanceScore: 0,
      eduTokensEarned: 0,
      linkTokensEarned: 0,
      adaptiveAdjustments: JSON.stringify({
        recommendationId,
        initialDifficulty,
        realTimeMetrics: realTimeMetrics
      })
    })
  }

  const pauseSession = () => {
    setSessionState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }))
    onSessionPause?.()
  }

  const nextStep = () => {
    const nextIndex = sessionState.currentStep + 1
    
    if (nextIndex < learningContent.length) {
      // Record performance for current step
      recordStepPerformance()
      
      setSessionState(prev => ({
        ...prev,
        currentStep: nextIndex
      }))
      setCurrentContent(learningContent[nextIndex])
      stepStartTime.current = Date.now()
      
      // Adapt difficulty if needed
      adaptDifficultyBasedOnPerformance()
    } else {
      completeSession()
    }
  }

  const recordStepPerformance = async () => {
    const stepDuration = (Date.now() - stepStartTime.current) / 1000 / 60 // minutes
    const expectedDuration = currentContent?.timeEstimate || 5
    const timeEfficiency = Math.min(2, expectedDuration / stepDuration)
    
    // Calculate performance score based on time efficiency and engagement
    const performanceScore = Math.round(
      (timeEfficiency * 0.4 + realTimeMetrics.comprehensionRate * 0.3 + realTimeMetrics.engagementLevel * 0.3) * 100
    )

    await blink.db.performanceHistory.create({
      id: `perf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      sessionId: recommendationId,
      skillId,
      assessmentType: currentContent?.type || 'general',
      score: performanceScore,
      timeTaken: Math.round(stepDuration * 60), // seconds
      difficultyLevel: sessionState.difficulty,
      contentFormat: contentType,
      cognitiveLoadRating: realTimeMetrics.focusScore
    })

    // Update session performance
    setSessionState(prev => ({
      ...prev,
      performance: (prev.performance + performanceScore) / (prev.currentStep + 1)
    }))
  }

  const adaptDifficultyBasedOnPerformance = () => {
    const avgPerformance = sessionState.performance
    const newAdaptations: string[] = []

    if (avgPerformance > 85 && sessionState.difficulty === 'beginner') {
      setSessionState(prev => ({
        ...prev,
        difficulty: 'intermediate',
        adaptations: [...prev.adaptations, 'Difficulté augmentée vers intermédiaire']
      }))
      newAdaptations.push('Difficulté augmentée')
    } else if (avgPerformance < 60 && sessionState.difficulty === 'intermediate') {
      setSessionState(prev => ({
        ...prev,
        difficulty: 'beginner',
        adaptations: [...prev.adaptations, 'Difficulté réduite vers débutant']
      }))
      newAdaptations.push('Difficulté réduite')
    } else if (avgPerformance > 90 && sessionState.difficulty === 'intermediate') {
      setSessionState(prev => ({
        ...prev,
        difficulty: 'advanced',
        adaptations: [...prev.adaptations, 'Difficulté augmentée vers avancé']
      }))
      newAdaptations.push('Difficulté avancée débloquée')
    }

    // Adjust cognitive load
    if (realTimeMetrics.focusScore < 0.6) {
      setSessionState(prev => ({
        ...prev,
        cognitiveLoad: Math.max(0.2, prev.cognitiveLoad - 0.1),
        adaptations: [...prev.adaptations, 'Charge cognitive réduite']
      }))
      newAdaptations.push('Charge cognitive optimisée')
    }

    return newAdaptations
  }

  const updateRealTimeMetrics = () => {
    // Simulate real-time metrics (in real app, this would use actual user behavior tracking)
    const timeInStep = (Date.now() - stepStartTime.current) / 1000 / 60
    const expectedTime = currentContent?.timeEstimate || 5
    
    setRealTimeMetrics(prev => ({
      focusScore: Math.max(0.3, Math.min(1.0, 1.2 - (timeInStep / expectedTime))),
      comprehensionRate: Math.min(1.0, prev.comprehensionRate + (Math.random() - 0.3) * 0.1),
      engagementLevel: Math.max(0.4, Math.min(1.0, prev.engagementLevel + (Math.random() - 0.4) * 0.2)),
      learningVelocity: expectedTime / Math.max(timeInStep, 0.5)
    }))
  }

  const completeSession = async () => {
    const totalDuration = sessionState.timeElapsed / 60 // minutes
    const finalPerformance = sessionState.performance
    
    // Calculate tokens earned based on performance and time
    const baseTokens = Math.round(totalDuration * 2) // 2 tokens per minute
    const performanceBonus = Math.round((finalPerformance / 100) * baseTokens)
    const totalTokens = baseTokens + performanceBonus

    setSessionState(prev => ({
      ...prev,
      isActive: false,
      tokensEarned: totalTokens
    }))

    // Update user profile with earned tokens
    await blink.db.userProfiles.update(userId, {
      eduTokens: userProfile.eduTokens + totalTokens,
      totalExperience: userProfile.totalExperience + Math.round(finalPerformance)
    })

    // Update session completion
    await blink.db.learningSessions.update(recommendationId, {
      durationMinutes: Math.round(totalDuration),
      completionPercentage: 100,
      performanceScore: Math.round(finalPerformance),
      eduTokensEarned: totalTokens,
      completedAt: new Date().toISOString()
    })

    onSessionComplete({
      duration: totalDuration,
      performance: finalPerformance,
      tokensEarned: totalTokens,
      adaptations: sessionState.adaptations,
      metrics: realTimeMetrics
    })
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <BookOpen className="h-5 w-5" />
      case 'podcast': return <Headphones className="h-5 w-5" />
      case 'interactive': return <GamepadIcon className="h-5 w-5" />
      case 'reading': return <FileText className="h-5 w-5" />
      default: return <BookOpen className="h-5 w-5" />
    }
  }

  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case 'explanation': return <Eye className="h-4 w-4" />
      case 'exercise': return <Hand className="h-4 w-4" />
      case 'quiz': return <Brain className="h-4 w-4" />
      case 'reflection': return <Lightbulb className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400'
      case 'intermediate': return 'text-yellow-400'
      case 'advanced': return 'text-red-400'
      default: return 'text-primary'
    }
  }

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card className="cosmic-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getContentTypeIcon(contentType)}
              <div>
                <CardTitle className="text-xl">Session d'Apprentissage Adaptative</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Compétence: {skillId} • Type: {contentType} • Durée estimée: {estimatedDuration} min
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`cosmic-border ${getDifficultyColor(sessionState.difficulty)}`}>
                {sessionState.difficulty}
              </Badge>
              {sessionState.adaptations.length > 0 && (
                <Badge variant="secondary" className="cosmic-border">
                  <Sparkles className="mr-1 h-3 w-3" />
                  {sessionState.adaptations.length} adaptations
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Session Progress */}
      <Card className="cosmic-border">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progression de la session</span>
              <span className="text-sm text-muted-foreground">
                Étape {sessionState.currentStep + 1} sur {sessionState.totalSteps}
              </span>
            </div>
            <Progress 
              value={(sessionState.currentStep / sessionState.totalSteps) * 100} 
              className="h-3" 
            />
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/20">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Timer className="h-4 w-4 text-primary" />
                  <span className="text-lg font-bold">
                    {Math.floor(sessionState.timeElapsed / 60)}:{(sessionState.timeElapsed % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Temps écoulé</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  <span className="text-lg font-bold">{Math.round(sessionState.performance)}%</span>
                </div>
                <p className="text-xs text-muted-foreground">Performance</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-lg font-bold">{sessionState.tokensEarned}</span>
                </div>
                <p className="text-xs text-muted-foreground">Tokens $EDU</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      <Card className="cosmic-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5 text-accent" />
            Métriques Temps Réel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Focus</span>
                <span className="text-sm font-medium">{Math.round(realTimeMetrics.focusScore * 100)}%</span>
              </div>
              <Progress value={realTimeMetrics.focusScore * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Compréhension</span>
                <span className="text-sm font-medium">{Math.round(realTimeMetrics.comprehensionRate * 100)}%</span>
              </div>
              <Progress value={realTimeMetrics.comprehensionRate * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Engagement</span>
                <span className="text-sm font-medium">{Math.round(realTimeMetrics.engagementLevel * 100)}%</span>
              </div>
              <Progress value={realTimeMetrics.engagementLevel * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Vélocité</span>
                <span className="text-sm font-medium">{realTimeMetrics.learningVelocity.toFixed(1)}x</span>
              </div>
              <Progress value={Math.min(realTimeMetrics.learningVelocity * 50, 100)} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Learning Content */}
      {currentContent && (
        <Card className="cosmic-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStepTypeIcon(currentContent.type)}
                <div>
                  <CardTitle>{currentContent.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {currentContent.type} • {currentContent.timeEstimate} min estimé
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="cosmic-border">
                Charge cognitive: {Math.round(currentContent.cognitiveLoad * 100)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground whitespace-pre-wrap">{currentContent.content}</p>
            </div>
            
            {currentContent.adaptiveHints && currentContent.adaptiveHints.length > 0 && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Lightbulb className="mr-2 h-4 w-4 text-primary" />
                  Conseils adaptatifs
                </h4>
                <ul className="text-sm space-y-1">
                  {currentContent.adaptiveHints.map((hint, index) => (
                    <li key={index} className="text-muted-foreground">• {hint}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {sessionState.adaptations.length > 0 && (
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Sparkles className="mr-2 h-4 w-4 text-accent" />
                  Adaptations automatiques
                </h4>
                <div className="flex flex-wrap gap-2">
                  {sessionState.adaptations.slice(-3).map((adaptation, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {adaptation}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Session Controls */}
      <Card className="cosmic-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-4">
            {!sessionState.isActive ? (
              <Button onClick={startSession} size="lg" className="cosmic-glow">
                <Play className="mr-2 h-5 w-5" />
                Commencer la Session
              </Button>
            ) : (
              <>
                <Button 
                  onClick={pauseSession} 
                  variant="outline" 
                  size="lg"
                  className="cosmic-border"
                >
                  {sessionState.isPaused ? (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Reprendre
                    </>
                  ) : (
                    <>
                      <Pause className="mr-2 h-5 w-5" />
                      Pause
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={nextStep} 
                  size="lg" 
                  className="cosmic-glow"
                  disabled={sessionState.isPaused}
                >
                  {sessionState.currentStep === sessionState.totalSteps - 1 ? (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Terminer Session
                    </>
                  ) : (
                    <>
                      <SkipForward className="mr-2 h-5 w-5" />
                      Étape Suivante
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={() => setSessionState(prev => ({ ...prev, currentStep: Math.max(0, prev.currentStep - 1) }))}
                  variant="outline"
                  disabled={sessionState.currentStep === 0 || sessionState.isPaused}
                  className="cosmic-border"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Étape Précédente
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdaptiveLearningSession