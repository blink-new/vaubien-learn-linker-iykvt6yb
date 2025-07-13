import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Lightbulb, 
  Zap,
  Clock,
  Star,
  CheckCircle,
  PlayCircle,
  BookOpen,
  Headphones,
  GamepadIcon,
  FileText,
  BarChart3,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Settings
} from 'lucide-react'
import blink from '../blink/client'

interface RecommendationEngineProps {
  userId: string
  userProfile: any
  onRecommendationUpdate?: () => void
}

interface AdaptiveRecommendation {
  id: string
  title: string
  description: string
  skillId: string
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
  contentType: 'video' | 'podcast' | 'interactive' | 'reading'
  estimatedDuration: number
  priorityScore: number
  gnosisReasoning: string
  learningObjectives: string[]
  adaptiveAdjustments: any
  isAccepted: boolean
  isCompleted: boolean
}

interface LearningPattern {
  preferredDifficulty: number
  optimalSessionDuration: number
  bestPerformanceTimeOfDay: string
  contentTypeEffectiveness: Record<string, number>
  cognitiveLoad: number
  motivationLevel: number
}

const GnosisRecommendationEngine = ({ userId, userProfile, onRecommendationUpdate }: RecommendationEngineProps) => {
  const [recommendations, setRecommendations] = useState<AdaptiveRecommendation[]>([])
  const [learningPattern, setLearningPattern] = useState<LearningPattern | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [engineStatus, setEngineStatus] = useState({
    lastAnalysis: null as string | null,
    totalRecommendations: 0,
    acceptanceRate: 0,
    adaptationScore: 0
  })

  useEffect(() => {
    loadRecommendations()
    analyzeLearningPatterns()
    loadEngineStatus()
  }, [userId])

  const loadRecommendations = async () => {
    try {
      const recs = await blink.db.courseRecommendations.list({
        where: { userId },
        orderBy: { priorityScore: 'desc' },
        limit: 20
      })
      setRecommendations(recs)
    } catch (error) {
      console.error('Error loading recommendations:', error)
    }
  }

  const loadEngineStatus = async () => {
    try {
      const allRecs = await blink.db.courseRecommendations.list({
        where: { userId }
      })
      
      const accepted = allRecs.filter(r => r.isAccepted).length
      const total = allRecs.length
      
      setEngineStatus({
        lastAnalysis: allRecs.length > 0 ? allRecs[0].createdAt : null,
        totalRecommendations: total,
        acceptanceRate: total > 0 ? (accepted / total) * 100 : 0,
        adaptationScore: total > 0 ? Math.min(95, 60 + (accepted / total) * 35) : 0
      })
    } catch (error) {
      console.error('Error loading engine status:', error)
    }
  }

  const analyzeLearningPatterns = async () => {
    try {
      // Get comprehensive user data for pattern analysis
      const [sessions, performance, analytics] = await Promise.all([
        blink.db.learningSessions.list({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          limit: 50
        }),
        blink.db.performanceHistory.list({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          limit: 100
        }),
        blink.db.learningAnalytics.list({
          where: { userId },
          orderBy: { date: 'desc' },
          limit: 30
        })
      ])

      // Advanced pattern analysis
      const patterns: LearningPattern = {
        preferredDifficulty: calculatePreferredDifficulty(performance),
        optimalSessionDuration: calculateOptimalDuration(sessions),
        bestPerformanceTimeOfDay: calculateBestTimeOfDay(sessions),
        contentTypeEffectiveness: calculateContentEffectiveness(sessions, performance),
        cognitiveLoad: calculateCognitiveLoad(performance),
        motivationLevel: calculateMotivationLevel(analytics, sessions)
      }

      setLearningPattern(patterns)
      
      // Update user profile with new patterns
      await updateCognitiveProfile(patterns)
    } catch (error) {
      console.error('Error analyzing learning patterns:', error)
    }
  }

  const calculatePreferredDifficulty = (performance: any[]) => {
    if (performance.length === 0) return 0.5
    
    const difficultyScores = performance.map(p => ({
      difficulty: p.difficultyLevel === 'beginner' ? 0.3 : p.difficultyLevel === 'intermediate' ? 0.6 : 0.9,
      score: p.score
    }))
    
    // Find difficulty level with best performance
    const avgByDifficulty = difficultyScores.reduce((acc, curr) => {
      const key = curr.difficulty.toString()
      if (!acc[key]) acc[key] = { total: 0, count: 0 }
      acc[key].total += curr.score
      acc[key].count += 1
      return acc
    }, {} as Record<string, { total: number, count: number }>)
    
    let bestDifficulty = 0.5
    let bestScore = 0
    
    Object.entries(avgByDifficulty).forEach(([difficulty, data]) => {
      const avg = data.total / data.count
      if (avg > bestScore) {
        bestScore = avg
        bestDifficulty = parseFloat(difficulty)
      }
    })
    
    return bestDifficulty
  }

  const calculateOptimalDuration = (sessions: any[]) => {
    if (sessions.length === 0) return 30
    
    // Find duration with best completion rates
    const durationGroups = sessions.reduce((acc, session) => {
      const duration = session.durationMinutes
      const group = duration < 15 ? 'short' : duration < 45 ? 'medium' : 'long'
      if (!acc[group]) acc[group] = { completions: 0, total: 0, totalDuration: 0 }
      acc[group].total += 1
      acc[group].totalDuration += duration
      if (session.completionPercentage >= 80) acc[group].completions += 1
      return acc
    }, {} as Record<string, any>)
    
    let bestGroup = 'medium'
    let bestRate = 0
    
    Object.entries(durationGroups).forEach(([group, data]) => {
      const rate = data.completions / data.total
      if (rate > bestRate) {
        bestRate = rate
        bestGroup = group
      }
    })
    
    const groupDurations = { short: 15, medium: 30, long: 60 }
    return groupDurations[bestGroup as keyof typeof groupDurations] || 30
  }

  const calculateBestTimeOfDay = (sessions: any[]) => {
    if (sessions.length === 0) return 'morning'
    
    const timeGroups = sessions.reduce((acc, session) => {
      const hour = new Date(session.startedAt).getHours()
      const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
      if (!acc[timeOfDay]) acc[timeOfDay] = { score: 0, count: 0 }
      acc[timeOfDay].score += session.performanceScore || 0
      acc[timeOfDay].count += 1
      return acc
    }, {} as Record<string, any>)
    
    let bestTime = 'morning'
    let bestAvg = 0
    
    Object.entries(timeGroups).forEach(([time, data]) => {
      const avg = data.score / data.count
      if (avg > bestAvg) {
        bestAvg = avg
        bestTime = time
      }
    })
    
    return bestTime
  }

  const calculateContentEffectiveness = (sessions: any[], performance: any[]) => {
    const contentTypes = ['video', 'podcast', 'interactive', 'reading']
    const effectiveness: Record<string, number> = {}
    
    contentTypes.forEach(type => {
      const typeSessions = sessions.filter(s => s.contentFormat === type)
      const typePerformance = performance.filter(p => p.contentFormat === type)
      
      if (typeSessions.length > 0 && typePerformance.length > 0) {
        const avgCompletion = typeSessions.reduce((acc, s) => acc + s.completionPercentage, 0) / typeSessions.length
        const avgScore = typePerformance.reduce((acc, p) => acc + p.score, 0) / typePerformance.length
        effectiveness[type] = (avgCompletion + avgScore) / 2
      } else {
        effectiveness[type] = 50 // Default neutral score
      }
    })
    
    return effectiveness
  }

  const calculateCognitiveLoad = (performance: any[]) => {
    if (performance.length === 0) return 0.5
    
    // Analyze time taken vs performance to determine cognitive load capacity
    const loadMetrics = performance.map(p => ({
      timeEfficiency: p.timeTaken ? Math.min(1, 300 / p.timeTaken) : 0.5, // Optimal at 5 min
      accuracyRate: p.totalQuestions > 0 ? p.correctAnswers / p.totalQuestions : 0.5
    }))
    
    const avgEfficiency = loadMetrics.reduce((acc, m) => acc + m.timeEfficiency, 0) / loadMetrics.length
    const avgAccuracy = loadMetrics.reduce((acc, m) => acc + m.accuracyRate, 0) / loadMetrics.length
    
    // Higher cognitive load capacity = can handle more complex content
    return (avgEfficiency + avgAccuracy) / 2
  }

  const calculateMotivationLevel = (analytics: any[], sessions: any[]) => {
    if (analytics.length === 0) return 0.5
    
    // Analyze consistency and engagement trends
    const recentWeeks = analytics.slice(0, 14) // Last 2 weeks
    if (recentWeeks.length < 7) return 0.5
    
    const firstWeek = recentWeeks.slice(7, 14)
    const secondWeek = recentWeeks.slice(0, 7)
    
    const firstWeekAvg = firstWeek.reduce((acc, day) => acc + day.totalLearningTime, 0) / firstWeek.length
    const secondWeekAvg = secondWeek.reduce((acc, day) => acc + day.totalLearningTime, 0) / secondWeek.length
    
    // Motivation increases if learning time is increasing or stable
    const trend = secondWeekAvg >= firstWeekAvg ? 1 : secondWeekAvg / firstWeekAvg
    const consistency = secondWeek.filter(day => day.totalLearningTime > 0).length / 7
    
    return Math.min(1, (trend + consistency) / 2)
  }

  const updateCognitiveProfile = async (patterns: LearningPattern) => {
    try {
      const cognitiveProfile = {
        learningPatterns: patterns,
        strengths: identifyStrengths(patterns),
        improvementAreas: identifyImprovementAreas(patterns),
        lastUpdated: new Date().toISOString(),
        adaptationScore: calculateAdaptationScore(patterns)
      }

      await blink.db.userProfiles.update(userProfile.id, {
        cognitiveProfile: JSON.stringify(cognitiveProfile)
      })
    } catch (error) {
      console.error('Error updating cognitive profile:', error)
    }
  }

  const identifyStrengths = (patterns: LearningPattern) => {
    const strengths = []
    
    if (patterns.motivationLevel > 0.7) strengths.push('Très motivé')
    if (patterns.cognitiveLoad > 0.7) strengths.push('Capacité cognitive élevée')
    if (patterns.optimalSessionDuration > 45) strengths.push('Endurance d\'apprentissage')
    
    const bestContentType = Object.entries(patterns.contentTypeEffectiveness)
      .sort(([,a], [,b]) => b - a)[0]
    if (bestContentType && bestContentType[1] > 70) {
      strengths.push(`Excellence en ${bestContentType[0]}`)
    }
    
    return strengths
  }

  const identifyImprovementAreas = (patterns: LearningPattern) => {
    const areas = []
    
    if (patterns.motivationLevel < 0.4) areas.push('Motivation à maintenir')
    if (patterns.cognitiveLoad < 0.4) areas.push('Gestion de la charge cognitive')
    if (patterns.optimalSessionDuration < 20) areas.push('Concentration prolongée')
    
    const weakContentTypes = Object.entries(patterns.contentTypeEffectiveness)
      .filter(([,score]) => score < 50)
      .map(([type]) => type)
    
    if (weakContentTypes.length > 0) {
      areas.push(`Amélioration en ${weakContentTypes.join(', ')}`)
    }
    
    return areas
  }

  const calculateAdaptationScore = (patterns: LearningPattern) => {
    const scores = [
      patterns.motivationLevel * 25,
      patterns.cognitiveLoad * 25,
      (patterns.optimalSessionDuration / 60) * 25, // Max score for 60+ min sessions
      Math.max(...Object.values(patterns.contentTypeEffectiveness)) * 0.25
    ]
    
    return scores.reduce((acc, score) => acc + score, 0)
  }

  const generateHyperPersonalizedRecommendations = async () => {
    setIsAnalyzing(true)
    try {
      if (!learningPattern) {
        await analyzeLearningPatterns()
        return
      }

      // Get user's current skills and learning gaps
      const userSkills = await blink.db.userSkills.list({
        where: { userId },
        orderBy: { masteryPercentage: 'asc' }
      })

      const performanceHistory = await blink.db.performanceHistory.list({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        limit: 50
      })

      // AI-powered hyper-personalized recommendation generation
      for (const skill of userSkills.slice(0, 3)) {
        const skillPerformance = performanceHistory.filter(p => p.skillId === skill.skillId)
        
        const hyperPersonalizedPrompt = `
          MISSION: Créer une session d'apprentissage HYPER-PERSONNALISÉE avec IA avancée

          PROFIL COGNITIF DÉTAILLÉ:
          - Difficulté préférée: ${learningPattern.preferredDifficulty * 100}%
          - Durée optimale: ${learningPattern.optimalSessionDuration} min
          - Meilleur moment: ${learningPattern.bestPerformanceTimeOfDay}
          - Charge cognitive: ${learningPattern.cognitiveLoad * 100}%
          - Motivation: ${learningPattern.motivationLevel * 100}%
          
          EFFICACITÉ PAR TYPE DE CONTENU:
          ${Object.entries(learningPattern.contentTypeEffectiveness)
            .map(([type, score]) => `- ${type}: ${Math.round(score)}%`)
            .join('\n')}

          COMPÉTENCE CIBLÉE:
          - Nom: ${skill.skillName} (${skill.category})
          - Niveau: ${skill.currentLevel}/${skill.maxLevel}
          - Maîtrise: ${skill.masteryPercentage}%
          - État: ${skill.isUnlocked ? 'Débloquée' : 'Verrouillée'}

          HISTORIQUE PERFORMANCE:
          ${skillPerformance.slice(0, 5).map(p => 
            `- ${p.assessmentType}: ${p.score}/100, temps: ${p.timeTaken}s, charge: ${p.cognitiveLoadRating || 'N/A'}`
          ).join('\n') || 'Aucune donnée de performance'}

          ALGORITHME DE PERSONNALISATION:
          1. Adapte la difficulté selon les patterns de réussite
          2. Optimise le format selon l'efficacité mesurée
          3. Calibre la durée selon l'attention optimale
          4. Intègre la motivation et charge cognitive
          5. Propose des micro-ajustements en temps réel

          Génère une session d'apprentissage révolutionnaire avec:
          - Titre accrocheur et motivant
          - Description détaillée (3-4 phrases)
          - Niveau de difficulté ultra-précis
          - Format optimal selon les données
          - Durée parfaitement calibrée
          - Stratégie pédagogique avancée
          - Objectifs d'apprentissage spécifiques
          - Mécanismes d'adaptation temps réel
        `

        const { object } = await blink.ai.generateObject({
          prompt: hyperPersonalizedPrompt,
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
              },
              adaptiveAdjustments: {
                type: 'object',
                properties: {
                  difficultyCalibration: { type: 'string' },
                  cognitiveLoadManagement: { type: 'string' },
                  motivationBoosters: { type: 'array', items: { type: 'string' } },
                  realTimeAdaptations: { type: 'array', items: { type: 'string' } }
                }
              }
            },
            required: ['title', 'description', 'difficultyLevel', 'contentType', 'estimatedDuration', 'strategicReasoning', 'learningObjectives', 'adaptiveAdjustments']
          }
        })

        // Calculate sophisticated priority score
        const priorityScore = calculateSophisticatedPriority(skill, skillPerformance, learningPattern)

        // Save hyper-personalized recommendation
        const recommendation = await blink.db.courseRecommendations.create({
          id: `hyper-rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

        // Save detailed adaptive data
        await blink.db.adaptiveContent.create({
          id: `adaptive-${recommendation.id}`,
          skillId: skill.skillId,
          contentType: object.contentType,
          difficultyLevel: object.difficultyLevel,
          title: object.title,
          contentData: JSON.stringify({
            learningObjectives: object.learningObjectives,
            adaptiveAdjustments: object.adaptiveAdjustments,
            personalizationData: {
              cognitiveProfile: learningPattern,
              performanceHistory: skillPerformance.slice(0, 5)
            }
          }),
          learningObjectives: JSON.stringify(object.learningObjectives),
          estimatedDuration: object.estimatedDuration,
          cognitiveeTags: JSON.stringify([
            `difficulty_${learningPattern.preferredDifficulty}`,
            `duration_${learningPattern.optimalSessionDuration}`,
            `motivation_${learningPattern.motivationLevel}`,
            `cognitive_load_${learningPattern.cognitiveLoad}`
          ])
        })

        // Small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      await loadRecommendations()
      await loadEngineStatus()
      onRecommendationUpdate?.()

    } catch (error) {
      console.error('Error generating hyper-personalized recommendations:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const calculateSophisticatedPriority = (skill: any, performance: any[], patterns: LearningPattern) => {
    let priorityScore = 0
    
    // Skill mastery factor (lower mastery = higher priority)
    priorityScore += (100 - skill.masteryPercentage) * 0.3
    
    // Unlock status factor
    priorityScore += skill.isUnlocked ? 30 : 10
    
    // Performance trend factor
    if (performance.length > 0) {
      const avgScore = performance.reduce((acc, p) => acc + p.score, 0) / performance.length
      priorityScore += (100 - avgScore) * 0.2
    }
    
    // Motivation alignment factor
    priorityScore += patterns.motivationLevel * 20
    
    // Cognitive load compatibility factor
    priorityScore += patterns.cognitiveLoad * 15
    
    // Content type effectiveness factor
    const bestContentType = Object.entries(patterns.contentTypeEffectiveness)
      .sort(([,a], [,b]) => b - a)[0]
    if (bestContentType) {
      priorityScore += (bestContentType[1] / 100) * 10
    }
    
    // Normalize to 0-1 range
    return Math.min(1, priorityScore / 100)
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <BookOpen className="h-4 w-4" />
      case 'podcast': return <Headphones className="h-4 w-4" />
      case 'interactive': return <GamepadIcon className="h-4 w-4" />
      case 'reading': return <FileText className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'advanced': return 'bg-red-500/10 text-red-400 border-red-500/20'
      default: return 'bg-primary/10 text-primary border-primary/20'
    }
  }

  const formatTimeOfDay = (time: string) => {
    const times = {
      morning: '🌅 Matin (6h-12h)',
      afternoon: '☀️ Après-midi (12h-18h)',
      evening: '🌆 Soir (18h-24h)'
    }
    return times[time as keyof typeof times] || time
  }

  return (
    <div className="space-y-6">
      {/* Engine Status Dashboard */}
      <Card className="cosmic-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-primary" />
              Moteur de Recommandations Gnosis IA
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="cosmic-border">
                Score d'adaptation: {Math.round(engineStatus.adaptationScore)}%
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={generateHyperPersonalizedRecommendations}
                disabled={isAnalyzing}
                className="cosmic-border"
              >
                {isAnalyzing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-primary/10">
              <div className="text-2xl font-bold text-primary">{engineStatus.totalRecommendations}</div>
              <p className="text-xs text-muted-foreground">Recommandations générées</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-accent/10">
              <div className="text-2xl font-bold text-accent">{Math.round(engineStatus.acceptanceRate)}%</div>
              <p className="text-xs text-muted-foreground">Taux d'acceptation</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-500/10">
              <div className="text-2xl font-bold text-green-400">{Math.round(engineStatus.adaptationScore)}%</div>
              <p className="text-xs text-muted-foreground">Score d'adaptation</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-500/10">
              <div className="text-2xl font-bold text-blue-400">
                {engineStatus.lastAnalysis ? 
                  new Date(engineStatus.lastAnalysis).toLocaleDateString() : 
                  'Jamais'
                }
              </div>
              <p className="text-xs text-muted-foreground">Dernière analyse</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Pattern Analysis */}
      {learningPattern && (
        <Card className="cosmic-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-accent" />
              Profil Cognitif Analysé
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Niveau de difficulté préféré</span>
                    <span className="text-sm text-primary">{Math.round(learningPattern.preferredDifficulty * 100)}%</span>
                  </div>
                  <Progress value={learningPattern.preferredDifficulty * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Capacité cognitive</span>
                    <span className="text-sm text-accent">{Math.round(learningPattern.cognitiveLoad * 100)}%</span>
                  </div>
                  <Progress value={learningPattern.cognitiveLoad * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Niveau de motivation</span>
                    <span className="text-sm text-green-400">{Math.round(learningPattern.motivationLevel * 100)}%</span>
                  </div>
                  <Progress value={learningPattern.motivationLevel * 100} className="h-2" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Durée optimale de session</p>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-lg font-bold">{learningPattern.optimalSessionDuration} minutes</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Meilleur moment d'apprentissage</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{formatTimeOfDay(learningPattern.bestPerformanceTimeOfDay)}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Efficacité par type de contenu</p>
                  <div className="space-y-2">
                    {Object.entries(learningPattern.contentTypeEffectiveness).map(([type, score]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getContentTypeIcon(type)}
                          <span className="text-sm capitalize">{type}</span>
                        </div>
                        <span className="text-sm font-medium">{Math.round(score)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hyper-Personalized Recommendations */}
      <Card className="cosmic-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-accent" />
              Recommandations Hyper-Personnalisées
            </div>
            <Button
              onClick={generateHyperPersonalizedRecommendations}
              disabled={isAnalyzing}
              className="cosmic-glow"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Génération IA...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Générer Recommandations
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recommendations.length === 0 ? (
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">Aucune recommandation disponible</h3>
              <p className="text-muted-foreground mb-4">
                Lancez l'analyse IA pour générer des recommandations personnalisées basées sur votre profil cognitif.
              </p>
              <Button onClick={generateHyperPersonalizedRecommendations} className="cosmic-glow">
                <Brain className="mr-2 h-4 w-4" />
                Analyser et Recommander
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations
                .filter(rec => !rec.isCompleted)
                .slice(0, 5)
                .map((rec) => (
                  <div key={rec.id} className="p-4 rounded-lg bg-muted/50 space-y-3 border border-accent/20">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{rec.title}</h4>
                          <Badge variant="outline" className={getDifficultyColor(rec.difficultyLevel)}>
                            {rec.difficultyLevel}
                          </Badge>
                          {rec.priorityScore > 0.8 && (
                            <Badge variant="destructive" className="text-xs">
                              <Star className="mr-1 h-3 w-3" />
                              Priorité Max
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                        {rec.gnosisReasoning && (
                          <div className="p-2 rounded bg-primary/10 mb-2">
                            <p className="text-xs text-primary italic">
                              🧠 Stratégie IA: {rec.gnosisReasoning}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 text-right">
                        {getContentTypeIcon(rec.contentType)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {rec.estimatedDuration} min
                        </div>
                        <div className="flex items-center text-accent">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          {Math.round(rec.priorityScore * 100)}% priorité
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 pt-2 border-t border-border/20">
                      {!rec.isAccepted ? (
                        <Button size="sm" className="cosmic-glow">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Accepter
                        </Button>
                      ) : (
                        <Button size="sm" className="cosmic-glow">
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Commencer
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Settings className="mr-2 h-4 w-4" />
                        Personnaliser
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default GnosisRecommendationEngine