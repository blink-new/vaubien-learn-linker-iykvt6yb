import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { Badge } from './components/ui/badge'
import { Progress } from './components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
import { Switch } from './components/ui/switch'
import { 
  Brain, 
  Coins, 
  TreePine, 
  Trophy, 
  Zap, 
  Star, 
  Sparkles, 
  BookOpen,
  Users,
  TrendingUp,
  Shield,
  Gamepad2,
  Crown,
  Calculator,
  Globe,
  Code,
  Music,
  Palette,
  Atom,
  MessageCircle,
  VolumeX,
  Volume2,
  Vote,
  Lock,
  Unlock,
  LogIn,
  User
} from 'lucide-react'
import SkillTree from './components/SkillTree'
import LearningDashboard from './components/LearningDashboard'
import blink from './blink/client'

function App() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userLevel, setUserLevel] = useState(12)
  const [eduTokens, setEduTokens] = useState(1247)
  const [linkTokens, setLinkTokens] = useState(892)
  const [isPremium, setIsPremium] = useState(false)
  const [showAds, setShowAds] = useState(!isPremium)

  // Token supply constants (21M max for both)
  const MAX_SUPPLY = 21000000
  const EDU_CIRCULATION = 15750000
  const LINK_CIRCULATION = 12340000

  // Next voting period for LINK increase
  const NEXT_VOTE_YEAR = 2028
  const VOTE_OPTIONS = [100, 1000, 10000, 100000]

  // Initialize authentication and user data
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setIsLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mx-auto cosmic-glow">
            <Brain className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-bold nebula-text">Vaubien Learn Linker</h2>
          <p className="text-muted-foreground">Initialisation de votre univers d'apprentissage...</p>
        </div>
      </div>
    )
  }

  // Authentication required
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur-md">
          <div className="container flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-3">
              <div className="cosmic-glow rounded-lg bg-gradient-to-r from-primary to-accent p-2">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold nebula-text">Vaubien Learn Linker</h1>
                <p className="text-xs text-muted-foreground">The First Mining Media for Knowledge</p>
              </div>
            </div>
            <Button onClick={() => blink.auth.login()} className="cosmic-glow">
              <LogIn className="mr-2 h-4 w-4" />
              Se connecter
            </Button>
          </div>
        </header>

        {/* Landing Page */}
        <main className="container px-6 py-16">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="floating-animation">
              <h2 className="text-6xl font-bold nebula-text mb-6">
                Bienvenue dans l'Univers de la Connaissance
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Découvrez l'apprentissage personnalisé alimenté par l'IA avec la technologie blockchain. 
                Développez vos compétences, gagnez des tokens, et rejoignez la révolution de l'éducation décentralisée.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="cosmic-border">
                <CardContent className="p-6 text-center">
                  <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">IA Gnosis Adaptative</h3>
                  <p className="text-sm text-muted-foreground">
                    Contenu personnalisé qui s'adapte à votre style d'apprentissage et évolue avec vous
                  </p>
                </CardContent>
              </Card>

              <Card className="cosmic-border">
                <CardContent className="p-6 text-center">
                  <Coins className="h-12 w-12 text-accent mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Économie Tokenisée</h3>
                  <p className="text-sm text-muted-foreground">
                    Gagnez des tokens $EDU et $LINK en apprenant et en contribuant à la communauté
                  </p>
                </CardContent>
              </Card>

              <Card className="cosmic-border">
                <CardContent className="p-6 text-center">
                  <TreePine className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Arbre de Compétences 3D</h3>
                  <p className="text-sm text-muted-foreground">
                    Visualisez votre progression à travers des parcours interconnectés de compétences
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button onClick={() => blink.auth.login()} size="lg" className="cosmic-glow text-lg px-8 py-4">
              <Sparkles className="mr-2 h-6 w-6" />
              Commencer l'Aventure
            </Button>

            <div className="pt-8 border-t border-primary/20">
              <h4 className="text-lg font-semibold mb-4">Fonctionnalités Avancées</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Certificats NFT</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-accent" />
                  <span>Chat IA Gnosis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Communauté DAO</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Vote className="h-4 w-4 text-accent" />
                  <span>Gouvernance Token</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <div className="cosmic-glow rounded-lg bg-gradient-to-r from-primary to-accent p-2">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold nebula-text">Vaubien Learn Linker</h1>
              <p className="text-xs text-muted-foreground">The First Mining Media for Knowledge</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              <TreePine className="mr-2 h-4 w-4" />
              Skill Tree
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              <BookOpen className="mr-2 h-4 w-4" />
              Learn
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              <Brain className="mr-2 h-4 w-4" />
              Gnosis AI
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              <Users className="mr-2 h-4 w-4" />
              Community
            </Button>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Premium Badge */}
            {isPremium && (
              <Badge variant="secondary" className="cosmic-border bg-gradient-to-r from-accent/20 to-primary/20">
                <Crown className="mr-1 h-3 w-3 text-accent" />
                Premium
              </Badge>
            )}
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="cosmic-border">
                <Coins className="mr-1 h-3 w-3 text-accent" />
                {eduTokens.toLocaleString()} $EDU
              </Badge>
              <Badge variant="secondary" className="cosmic-border">
                <Zap className="mr-1 h-3 w-3 text-primary" />
                {linkTokens.toLocaleString()} $LINK
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center cosmic-glow">
                <span className="text-sm font-bold text-white">{userLevel}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => blink.auth.logout()}
                className="text-muted-foreground hover:text-foreground"
              >
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Ad Banner (only for non-premium users) */}
      {showAds && !isPremium && (
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-primary/20 p-3">
          <div className="container flex items-center justify-between px-6">
            <div className="flex items-center space-x-3">
              <VolumeX className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Passez à Premium pour un apprentissage sans publicité et un mentorat humain
              </span>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="cosmic-glow">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade Now
                </Button>
              </DialogTrigger>
              <DialogContent className="cosmic-border">
                <DialogHeader>
                  <DialogTitle className="flex items-center nebula-text">
                    <Crown className="mr-2 h-5 w-5 text-accent" />
                    Abonnement Premium
                  </DialogTitle>
                  <DialogDescription>
                    Débloquez tout le potentiel de votre parcours d'apprentissage
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <VolumeX className="h-4 w-4 text-primary" />
                        <span>Expérience sans publicité</span>
                      </div>
                      <Badge variant="secondary">Inclus</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MessageCircle className="h-4 w-4 text-primary" />
                        <span>Support Mentor Humain</span>
                      </div>
                      <Badge variant="secondary">Inclus</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Brain className="h-4 w-4 text-primary" />
                        <span>IA Gnosis Avancée</span>
                      </div>
                      <Badge variant="secondary">Inclus</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Trophy className="h-4 w-4 text-primary" />
                        <span>Certificats NFT Exclusifs</span>
                      </div>
                      <Badge variant="secondary">Inclus</Badge>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold nebula-text">29.99€/mois</div>
                    <p className="text-sm text-muted-foreground">Annulation à tout moment</p>
                  </div>
                  <Button 
                    className="w-full cosmic-glow" 
                    size="lg"
                    onClick={() => {
                      setIsPremium(true)
                      setShowAds(false)
                    }}
                  >
                    <Crown className="mr-2 h-5 w-5" />
                    Commencer l'Essai Premium
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container px-6 py-8">
        <div className="grid gap-8">
          {/* Main Tabs Interface */}
          <section>
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-4 cosmic-border">
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary/20">
                  <Brain className="mr-2 h-4 w-4" />
                  Tableau de Bord
                </TabsTrigger>
                <TabsTrigger value="skills" className="data-[state=active]:bg-primary/20">
                  <TreePine className="mr-2 h-4 w-4" />
                  Arbre de Compétences
                </TabsTrigger>
                <TabsTrigger value="learn" className="data-[state=active]:bg-primary/20">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Apprendre
                </TabsTrigger>
                <TabsTrigger value="tokens" className="data-[state=active]:bg-primary/20">
                  <Coins className="mr-2 h-4 w-4" />
                  Tokens
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6 mt-8">
                <LearningDashboard userId={user.id} />
              </TabsContent>

              <TabsContent value="skills" className="space-y-6 mt-8">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold nebula-text">Univers d'Arbre de Compétences Interactif</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Naviguez dans votre parcours d'apprentissage à travers des nœuds de compétences interconnectés 
                    dans plusieurs disciplines
                  </p>
                </div>
                
                {/* 3D Skill Tree Component */}
                <SkillTree userLevel={userLevel} />
              </TabsContent>

              <TabsContent value="learn" className="space-y-6 mt-8">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold nebula-text">Modules d'Apprentissage Adaptatifs</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Le contenu s'adapte dynamiquement à votre style d'apprentissage et à vos progrès
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: "Mathématiques Fondamentales", type: "Interactif", progress: 75, difficulty: "Débutant", icon: Calculator },
                    { title: "Langues du Monde", type: "Conversation", progress: 45, difficulty: "Intermédiaire", icon: Globe },
                    { title: "Logique de Programmation", type: "Pratique", progress: 20, difficulty: "Avancé", icon: Code },
                    { title: "Géographie & Culture", type: "Visuel", progress: 90, difficulty: "Débutant", icon: Globe },
                    { title: "Théorie Musicale", type: "Audio", progress: 60, difficulty: "Intermédiaire", icon: Music },
                    { title: "Art Numérique", type: "Créatif", progress: 30, difficulty: "Avancé", icon: Palette },
                  ].map((module, i) => {
                    const IconComponent = module.icon
                    return (
                      <Card key={i} className="cosmic-border hover:cosmic-glow transition-all cursor-pointer">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-3">
                              <IconComponent className="h-6 w-6 text-primary" />
                              <CardTitle className="text-lg">{module.title}</CardTitle>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {module.difficulty}
                            </Badge>
                          </div>
                          <CardDescription>Apprentissage {module.type}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <Progress value={module.progress} className="h-2" />
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{module.progress}% Terminé</span>
                              <span className="text-primary">Continuer l'Apprentissage</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="tokens" className="space-y-6 mt-8">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold nebula-text">Économie de la Connaissance Tokenisée</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Gagnez des tokens $EDU en apprenant et des tokens $LINK en contribuant à la communauté
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="cosmic-border">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Coins className="mr-2 h-5 w-5 text-accent" />
                        Récompenses d'Apprentissage $EDU
                      </CardTitle>
                      <CardDescription>
                        Plafonné à 21M de tokens • Gagnez en complétant les modules
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-3xl font-bold text-accent">{eduTokens.toLocaleString()}</div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Objectif Quotidien</span>
                          <span className="text-sm text-accent">50 $EDU</span>
                        </div>
                        <Progress value={75} className="h-2" />
                        <p className="text-xs text-muted-foreground">37/50 tokens gagnés aujourd'hui</p>
                      </div>
                      <Button className="w-full" variant="outline">
                        Voir l'Historique de Gains
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cosmic-border">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Zap className="mr-2 h-5 w-5 text-primary" />
                        Tokens de Contribution $LINK
                      </CardTitle>
                      <CardDescription>
                        Tokens communautaires • Gagnez en aidant les autres à apprendre
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-3xl font-bold text-primary">{linkTokens.toLocaleString()}</div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Objectif Hebdomadaire</span>
                          <span className="text-sm text-primary">200 $LINK</span>
                        </div>
                        <Progress value={60} className="h-2" />
                        <p className="text-xs text-muted-foreground">120/200 tokens gagnés cette semaine</p>
                      </div>
                      <Button className="w-full" variant="outline">
                        <Vote className="mr-2 h-4 w-4" />
                        Pouvoir de Vote: {linkTokens.toLocaleString()}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Token Supply Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="cosmic-border">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Coins className="mr-2 h-5 w-5 text-accent" />
                          Économie Token $EDU
                        </div>
                        <Badge variant="outline">Récompenses d'Apprentissage</Badge>
                      </CardTitle>
                      <CardDescription>
                        Offre fixe plafonnée à 21 millions de tokens pour toujours
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Offre en Circulation</span>
                          <span className="text-accent">{EDU_CIRCULATION.toLocaleString()}</span>
                        </div>
                        <Progress value={(EDU_CIRCULATION / MAX_SUPPLY) * 100} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{((EDU_CIRCULATION / MAX_SUPPLY) * 100).toFixed(1)}% en circulation</span>
                          <span>Max: 21M</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cosmic-border">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Zap className="mr-2 h-5 w-5 text-primary" />
                          Économie Token $LINK
                        </div>
                        <Badge variant="outline">Contribution Communautaire</Badge>
                      </CardTitle>
                      <CardDescription>
                        Offre fixe avec vote communautaire quadriennal pour les augmentations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Offre Actuelle</span>
                          <span className="text-primary">{LINK_CIRCULATION.toLocaleString()}</span>
                        </div>
                        <Progress value={(LINK_CIRCULATION / MAX_SUPPLY) * 100} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Prochain vote: {NEXT_VOTE_YEAR}</span>
                          <span>Plafond actuel: 21M</span>
                        </div>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <Vote className="mr-2 h-4 w-4" />
                            Voir le Système de Vote
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="cosmic-border">
                          <DialogHeader>
                            <DialogTitle className="nebula-text">Mécanisme de Vote de l'Offre $LINK</DialogTitle>
                            <DialogDescription>
                              La communauté vote tous les 4 ans pour potentiellement augmenter l'offre LINK
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="text-center p-4 rounded-lg bg-primary/10">
                              <div className="text-sm text-muted-foreground mb-2">Prochaine Période de Vote</div>
                              <div className="text-2xl font-bold text-primary">{NEXT_VOTE_YEAR}</div>
                            </div>
                            
                            <div className="space-y-3">
                              <h4 className="font-semibold">Options de Vote pour l'Augmentation de l'Offre:</h4>
                              {VOTE_OPTIONS.map((option, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                  <span>Augmenter de {option.toLocaleString()} tokens</span>
                                  <Badge variant="secondary">
                                    {((option / LINK_CIRCULATION) * 100).toFixed(1)}% d'augmentation
                                  </Badge>
                                </div>
                              ))}
                            </div>
                            
                            <div className="text-center p-3 rounded-lg bg-primary/10">
                              <div className="text-lg font-semibold text-primary">Votre Solde</div>
                              <div className="text-2xl font-bold">{linkTokens.toLocaleString()} $LINK</div>
                              <div className="text-sm text-muted-foreground">Pouvoir de vote dans la prochaine élection</div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App