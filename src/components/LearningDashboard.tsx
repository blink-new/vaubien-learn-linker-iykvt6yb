import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Brain, 
  BookOpen, 
  TrendingUp, 
  Target, 
  Clock, 
  Star,
  Zap,
  Trophy,
  Coins,
  MessageCircle,
  Users,
  BarChart3,
  Calendar,
  Play,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Award,
  Crown,
  Settings,
  Activity,
  Flame,
  ChevronUp,
  ChevronDown,
  TrendingDown,
  Lightbulb
} from 'lucide-react'
import blink from '../blink/client'
import GnosisChat from './GnosisChat'
import GnosisRecommendationEngine from './GnosisRecommendationEngine'

interface UserProfile {
  id: string
  userId: string
  displayName: string
  learningStyle: string
  currentLevel: number
  totalExperience: number
  eduTokens: number
  linkTokens: number
  isPremium: boolean
  cognitiveProfile?: string
  performanceMetrics?: string
}

interface LearningSession {
  id: string
  skillId: string
  sessionType: string
  durationMinutes: number
  completionPercentage: number
  performanceScore: number
  eduTokensEarned: number
  linkTokensEarned: number
  startedAt: string
  completedAt?: string
  contentFormat?: string
  adaptiveAdjustments?: string
}

interface SkillProgress {
  id: string
  skillId: string
  skillName: string
  category: string
  currentLevel: number
  maxLevel: number
  isUnlocked: boolean
  masteryPercentage: number
  lastPracticed?: string
  prerequisites?: string
}

interface LearningAnalytics {
  id: string
  date: string
  totalLearningTime: number
  skillsPracticed: number
  eduTokensEarned: number
  linkTokensEarned: number
  streakDays: number
  sessionsCompleted: number
  avgPerformanceScore: number
}

interface LearningDashboardProps {
  userId: string
}

const LearningDashboard = ({ userId }: LearningDashboardProps) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [skills, setSkills] = useState<SkillProgress[]>([])
  const [recentSessions, setRecentSessions] = useState<LearningSession[]>([])
  const [weeklyAnalytics, setWeeklyAnalytics] = useState<LearningAnalytics[]>([])
  const [todayStats, setTodayStats] = useState({
    learningTime: 0,
    skillsPracticed: 0,
    eduTokensEarned: 0,
    linkTokensEarned: 0,
    streakDays: 0,
    sessionsCompleted: 0,
    avgPerformanceScore: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (userId) {
      loadUserData()
      // Auto-refresh data every 30 seconds
      const interval = setInterval(loadUserData, 30000)
      return () => clearInterval(interval)
    }
  }, [userId])

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      
      // Load or create user profile
      const profile = await blink.db.userProfiles.list({
        where: { userId },
        limit: 1
      })

      if (profile.length === 0) {
        // Create new profile with enhanced defaults
        const newProfile = await blink.db.userProfiles.create({
          id: `profile-${Date.now()}`,
          userId,
          displayName: 'Nouvel Apprenant',
          learningStyle: 'adaptive',
          currentLevel: 1,
          totalExperience: 0,
          eduTokens: 100,
          linkTokens: 50,
          isPremium: false,
          cognitiveProfile: JSON.stringify({
            learningPatterns: {
              preferredDifficulty: 0.5,
              averageSessionDuration: 0,
              contentTypePreferences: {
                video: 0,
                interactive: 0,
                reading: 0,
                podcast: 0
              }
            },
            strengths: [],
            improvementAreas: [],
            lastUpdated: new Date().toISOString()
          }),
          performanceMetrics: JSON.stringify({
            averageScore: 0,
            totalSessions: 0,
            completionRate: 0,
            streakRecord: 0
          })
        })
        setUserProfile(newProfile)
        
        // Initialize comprehensive skill set
        await initializeComprehensiveSkills()
      } else {
        setUserProfile(profile[0])
      }

      // Load user skills with better organization
      const userSkills = await blink.db.userSkills.list({
        where: { userId },
        orderBy: { masteryPercentage: 'desc' }
      })
      setSkills(userSkills)

      // Load recent learning sessions with more data
      const sessions = await blink.db.learningSessions.list({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        limit: 20
      })
      setRecentSessions(sessions)

      // Load weekly analytics for trends
      const analytics = await blink.db.learningAnalytics.list({
        where: { userId },
        orderBy: { date: 'desc' },
        limit: 7
      })
      setWeeklyAnalytics(analytics)

      // Load today's analytics with enhanced metrics
      const today = new Date().toISOString().split('T')[0]
      const todayAnalytics = await blink.db.learningAnalytics.list({
        where: { userId, date: today },
        limit: 1
      })
      
      if (todayAnalytics.length > 0) {
        setTodayStats({
          learningTime: todayAnalytics[0].totalLearningTime || 0,
          skillsPracticed: todayAnalytics[0].skillsPracticed || 0,
          eduTokensEarned: todayAnalytics[0].eduTokensEarned || 0,
          linkTokensEarned: todayAnalytics[0].linkTokensEarned || 0,
          streakDays: todayAnalytics[0].streakDays || 0,
          sessionsCompleted: todayAnalytics[0].sessionsCompleted || 0,
          avgPerformanceScore: todayAnalytics[0].avgPerformanceScore || 0
        })
      } else {
        // Create today's analytics entry
        await createTodayAnalytics()
      }

    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const initializeComprehensiveSkills = async () => {
    const comprehensiveSkills = [
      // Mathematics
      { id: 'math-arithmetic', name: 'Arithmétique', category: 'Mathematics', level: 1, unlocked: true },
      { id: 'math-algebra', name: 'Algèbre', category: 'Mathematics', level: 0, unlocked: false },
      { id: 'math-geometry', name: 'Géométrie', category: 'Mathematics', level: 0, unlocked: false },
      { id: 'math-calculus', name: 'Calcul Différentiel', category: 'Mathematics', level: 0, unlocked: false },
      { id: 'math-statistics', name: 'Statistiques', category: 'Mathematics', level: 0, unlocked: false },
      
      // Languages
      { id: 'lang-french', name: 'Français', category: 'Languages', level: 2, unlocked: true },
      { id: 'lang-english', name: 'Anglais', category: 'Languages', level: 1, unlocked: true },
      { id: 'lang-spanish', name: 'Espagnol', category: 'Languages', level: 0, unlocked: false },
      { id: 'lang-german', name: 'Allemand', category: 'Languages', level: 0, unlocked: false },
      
      // Sciences
      { id: 'science-physics', name: 'Physique', category: 'Science', level: 0, unlocked: false },
      { id: 'science-chemistry', name: 'Chimie', category: 'Science', level: 0, unlocked: false },
      { id: 'science-biology', name: 'Biologie', category: 'Science', level: 0, unlocked: false },
      { id: 'science-astronomy', name: 'Astronomie', category: 'Science', level: 0, unlocked: false },
      
      // Programming
      { id: 'prog-javascript', name: 'JavaScript', category: 'Programming', level: 0, unlocked: false },
      { id: 'prog-python', name: 'Python', category: 'Programming', level: 0, unlocked: false },
      { id: 'prog-react', name: 'React', category: 'Programming', level: 0, unlocked: false },
      { id: 'prog-ai-ml', name: 'IA & Machine Learning', category: 'Programming', level: 0, unlocked: false },
      
      // Arts & Creativity
      { id: 'art-drawing', name: 'Dessin', category: 'Arts', level: 1, unlocked: true },
      { id: 'art-painting', name: 'Peinture', category: 'Arts', level: 0, unlocked: false },
      { id: 'art-digital', name: 'Art Numérique', category: 'Arts', level: 0, unlocked: false },
      { id: 'art-photography', name: 'Photographie', category: 'Arts', level: 0, unlocked: false },
      
      // Music
      { id: 'music-theory', name: 'Théorie Musicale', category: 'Music', level: 0, unlocked: false },
      { id: 'music-piano', name: 'Piano', category: 'Music', level: 0, unlocked: false },
      { id: 'music-guitar', name: 'Guitare', category: 'Music', level: 0, unlocked: false },
      
      // Business & Entrepreneurship
      { id: 'business-marketing', name: 'Marketing', category: 'Business', level: 0, unlocked: false },
      { id: 'business-finance', name: 'Finance', category: 'Business', level: 0, unlocked: false },
      { id: 'business-management', name: 'Management', category: 'Business', level: 0, unlocked: false }
    ]

    for (const skill of comprehensiveSkills) {
      await blink.db.userSkills.create({
        id: `skill-${userId}-${skill.id}`,
        userId,
        skillId: skill.id,
        skillName: skill.name,
        category: skill.category,
        currentLevel: skill.level,
        maxLevel: 5,
        isUnlocked: skill.unlocked,
        masteryPercentage: skill.level * 20,
        prerequisites: JSON.stringify([])
      })
    }
  }

  const createTodayAnalytics = async () => {
    const today = new Date().toISOString().split('T')[0]
    
    try {
      await blink.db.learningAnalytics.create({
        id: `analytics-${userId}-${today}`,
        userId,
        date: today,
        totalLearningTime: 0,
        skillsPracticed: 0,
        eduTokensEarned: 0,
        linkTokensEarned: 0,
        streakDays: 1,
        sessionsCompleted: 0,
        avgPerformanceScore: 0,
        contentPreferences: JSON.stringify({})
      })
    } catch (error) {
      console.error('Error creating today analytics:', error)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'Mathematics': 'from-blue-400 to-blue-600',
      'Languages': 'from-green-400 to-green-600',
      'Science': 'from-red-400 to-red-600',
      'Programming': 'from-purple-400 to-purple-600',
      'Arts': 'from-pink-400 to-pink-600',
      'Music': 'from-indigo-400 to-indigo-600',
      'Business': 'from-yellow-400 to-yellow-600'
    }
    return colors[category as keyof typeof colors] || 'from-gray-400 to-gray-600'
  }

  const getLearningStyleDescription = (style: string) => {
    const descriptions = {
      'visual': 'Vous apprenez mieux avec des images, diagrammes et supports visuels',
      'auditory': 'Vous préférez les podcasts, discussions et explications orales',
      'kinesthetic': 'Vous apprenez par la pratique et l\'expérimentation',
      'adaptive': 'Style adaptatif qui combine plusieurs approches selon le contexte'
    }
    return descriptions[style as keyof typeof descriptions] || 'Style d\'apprentissage personnalisé'
  }

  const getStreakEmoji = (days: number) => {
    if (days >= 30) return '🔥'
    if (days >= 14) return '⚡'
    if (days >= 7) return '🌟'
    if (days >= 3) return '✨'
    return '🌱'
  }

  const calculateWeeklyProgress = () => {
    if (weeklyAnalytics.length === 0) return { totalTime: 0, avgScore: 0, trend: 'stable' }
    
    const totalTime = weeklyAnalytics.reduce((acc, day) => acc + day.totalLearningTime, 0)
    const avgScore = weeklyAnalytics.reduce((acc, day) => acc + day.avgPerformanceScore, 0) / weeklyAnalytics.length
    
    // Calculate trend (compare first half vs second half of week)
    const firstHalf = weeklyAnalytics.slice(-4)
    const secondHalf = weeklyAnalytics.slice(0, 3)
    
    const firstAvg = firstHalf.reduce((acc, day) => acc + day.totalLearningTime, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((acc, day) => acc + day.totalLearningTime, 0) / secondHalf.length
    
    const trend = secondAvg > firstAvg * 1.1 ? 'up' : secondAvg < firstAvg * 0.9 ? 'down' : 'stable'
    
    return { totalTime, avgScore, trend }
  }

  const getSkillsByCategory = () => {
    const categories = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    }, {} as Record<string, SkillProgress[]>)
    
    return categories
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <Brain className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Chargement de votre univers d'apprentissage...</p>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
        <p className="text-muted-foreground">Erreur de chargement du profil utilisateur</p>
        <Button onClick={loadUserData} className="mt-4">
          <Activity className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      </div>
    )
  }

  const weeklyProgress = calculateWeeklyProgress()
  const skillsByCategory = getSkillsByCategory()

  return (
    <div className="space-y-6">
      {/* Enhanced Welcome Header */}
      <Card className="cosmic-border bg-gradient-to-r from-primary/10 to-accent/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold nebula-text">
                  Bonjour {userProfile.displayName} ! 
                </h2>
                <div className="flex items-center space-x-1">
                  {getStreakEmoji(todayStats.streakDays)}
                  <span className="text-lg font-bold text-primary">{todayStats.streakDays}</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-2">
                {getLearningStyleDescription(userProfile.learningStyle)}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Activity className="mr-1 h-4 w-4 text-green-400" />
                  <span>Niveau {userProfile.currentLevel}</span>
                </div>
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 text-yellow-400" />
                  <span>{userProfile.totalExperience} XP</span>
                </div>
                {userProfile.isPremium && (
                  <div className="flex items-center">
                    <Crown className="mr-1 h-4 w-4 text-accent" />
                    <span>Premium</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-center space-x-4">
                <Badge className="cosmic-border">
                  <Coins className="mr-1 h-3 w-3 text-accent" />
                  {userProfile.eduTokens.toLocaleString()} $EDU
                </Badge>
                <Badge className="cosmic-border">
                  <Zap className="mr-1 h-3 w-3 text-primary" />
                  {userProfile.linkTokens.toLocaleString()} $LINK
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{weeklyProgress.totalTime} min cette semaine</span>
                {weeklyProgress.trend === 'up' && <ChevronUp className="h-4 w-4 text-green-400" />}
                {weeklyProgress.trend === 'down' && <ChevronDown className="h-4 w-4 text-red-400" />}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Today's Progress */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cosmic-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Temps d'étude</p>
                <p className="text-xl font-bold">{todayStats.learningTime} min</p>
                <p className="text-xs text-muted-foreground">Objectif: 60 min</p>
              </div>
            </div>
            <Progress value={(todayStats.learningTime / 60) * 100} className="h-1 mt-3" />
          </CardContent>
        </Card>

        <Card className="cosmic-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Compétences</p>
                <p className="text-xl font-bold">{todayStats.skillsPracticed}</p>
                <p className="text-xs text-muted-foreground">Pratiquées aujourd'hui</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cosmic-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Performance</p>
                <p className="text-xl font-bold">{Math.round(todayStats.avgPerformanceScore)}%</p>
                <p className="text-xs text-muted-foreground">Score moyen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cosmic-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Flame className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Série</p>
                <div className="flex items-center space-x-1">
                  <p className="text-xl font-bold">{todayStats.streakDays}</p>
                  <span className="text-lg">{getStreakEmoji(todayStats.streakDays)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Jours consécutifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 cosmic-border">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary/20">
            <BarChart3 className="mr-2 h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="skills" className="data-[state=active]:bg-primary/20">
            <Target className="mr-2 h-4 w-4" />
            Compétences
          </TabsTrigger>
          <TabsTrigger value="gnosis" className="data-[state=active]:bg-primary/20">
            <Brain className="mr-2 h-4 w-4" />
            Gnosis IA
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="data-[state=active]:bg-primary/20">
            <Lightbulb className="mr-2 h-4 w-4" />
            Recommandations
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary/20">
            <Activity className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="community" className="data-[state=active]:bg-primary/20">
            <Users className="mr-2 h-4 w-4" />
            Communauté
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enhanced Recent Learning Sessions */}
            <Card className="cosmic-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-primary" />
                    Sessions Récentes
                  </div>
                  <Badge variant="secondary">{recentSessions.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentSessions.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Aucune session d'apprentissage récente</p>
                    <Button size="sm" className="mt-3 cosmic-glow">
                      <Play className="mr-2 h-4 w-4" />
                      Commencer à apprendre
                    </Button>
                  </div>
                ) : (
                  recentSessions.slice(0, 6).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium">{session.skillId}</p>
                          <Badge variant="outline" className="text-xs">
                            {session.sessionType}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{session.durationMinutes} min</span>
                          <span>Score: {session.performanceScore}%</span>
                          {session.eduTokensEarned > 0 && (
                            <span className="text-accent">+{session.eduTokensEarned} $EDU</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={session.completedAt ? 'default' : 'secondary'}>
                          {session.completedAt ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {session.completedAt ? 'Terminé' : `${session.completionPercentage}%`}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Enhanced Weekly Analytics */}
            <Card className="cosmic-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-accent" />
                    Progression Hebdomadaire
                  </div>
                  <div className="flex items-center space-x-2">
                    {weeklyProgress.trend === 'up' && <ChevronUp className="h-4 w-4 text-green-400" />}
                    {weeklyProgress.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-400" />}
                    <span className="text-sm font-medium">
                      {weeklyProgress.trend === 'up' ? 'En hausse' : 
                       weeklyProgress.trend === 'down' ? 'En baisse' : 'Stable'}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Temps d'étude total</span>
                    <span className="text-sm font-medium text-primary">{weeklyProgress.totalTime} min</span>
                  </div>
                  <Progress value={Math.min((weeklyProgress.totalTime / 420) * 100, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground">Objectif hebdomadaire: 420 min (1h/jour)</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Performance moyenne</span>
                    <span className="text-sm font-medium text-accent">{Math.round(weeklyProgress.avgScore)}%</span>
                  </div>
                  <Progress value={weeklyProgress.avgScore} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Compétences développées</span>
                    <span className="text-sm font-medium text-primary">
                      {skills.filter(s => s.isUnlocked).length}/{skills.length}
                    </span>
                  </div>
                  <Progress 
                    value={(skills.filter(s => s.isUnlocked).length / skills.length) * 100} 
                    className="h-2" 
                  />
                </div>

                {/* Weekly overview mini chart */}
                <div className="pt-4 border-t border-border/20">
                  <h4 className="text-sm font-medium mb-3">Activité des 7 derniers jours</h4>
                  <div className="flex items-end justify-between h-16 space-x-1">
                    {weeklyAnalytics.slice().reverse().map((day, index) => (
                      <div key={day.id} className="flex flex-col items-center space-y-1">
                        <div 
                          className="w-6 bg-gradient-to-t from-primary to-accent rounded-t"
                          style={{ 
                            height: `${Math.max((day.totalLearningTime / 120) * 100, 10)}%` 
                          }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {new Date(day.date).toLocaleDateString('fr', { weekday: 'short' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6 mt-8">
          <div className="space-y-6">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-4 h-4 rounded bg-gradient-to-r ${getCategoryColor(category)}`} />
                  <h3 className="text-lg font-semibold">{category}</h3>
                  <Badge variant="secondary">
                    {categorySkills.filter(s => s.isUnlocked).length}/{categorySkills.length} débloquées
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySkills.map((skill) => (
                    <Card key={skill.id} className="cosmic-border">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold flex items-center">
                              {!skill.isUnlocked && <span className="mr-2">🔒</span>}
                              {skill.skillName}
                            </h4>
                            {skill.currentLevel === skill.maxLevel && (
                              <div className="flex items-center text-accent">
                                <Trophy className="h-4 w-4 mr-1" />
                                <span className="text-xs font-semibold">Maîtrisé</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Niveau {skill.currentLevel}/{skill.maxLevel}</span>
                              <span className="text-primary">{skill.masteryPercentage}%</span>
                            </div>
                            <Progress value={skill.masteryPercentage} className="h-2" />
                            {skill.lastPracticed && (
                              <p className="text-xs text-muted-foreground">
                                Dernière pratique: {new Date(skill.lastPracticed).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            {skill.isUnlocked ? (
                              <Button size="sm" className="cosmic-glow">
                                <Play className="mr-2 h-4 w-4" />
                                {skill.masteryPercentage > 0 ? 'Continuer' : 'Commencer'}
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" disabled>
                                <Target className="mr-2 h-4 w-4" />
                                Verrouillé
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gnosis" className="mt-8">
          <GnosisChat userId={userId} userProfile={userProfile} />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6 mt-8">
          <GnosisRecommendationEngine 
            userId={userId} 
            userProfile={userProfile} 
            onRecommendationUpdate={loadUserData}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-8">
          <Card className="cosmic-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-primary" />
                Analytiques Avancées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">Analytiques Détaillées</h3>
                <p className="text-muted-foreground mb-6">
                  Explorez vos patterns d'apprentissage, tendances de performance et insights personnalisés.
                </p>
                <Button className="cosmic-glow">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Voir les Insights IA
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-6 mt-8">
          <Card className="cosmic-border">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Communauté d'Apprentissage</h3>
              <p className="text-muted-foreground mb-4">
                Connectez-vous avec d'autres apprenants, partagez vos progrès et participez aux défis communautaires.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                <div className="text-center p-3 rounded-lg bg-primary/10">
                  <MessageCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium">Forums de Discussion</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-accent/10">
                  <Award className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="text-xs font-medium">Défis Communautaires</p>
                </div>
              </div>
              <Button className="cosmic-glow">
                <Users className="mr-2 h-4 w-4" />
                Rejoindre la Communauté
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default LearningDashboard