import { useState } from 'react'
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
  Unlock
} from 'lucide-react'
import SkillTree from './components/SkillTree'

function App() {
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
              <Users className="mr-2 h-4 w-4" />
              Community
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              <Trophy className="mr-2 h-4 w-4" />
              Achievements
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
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center cosmic-glow">
              <span className="text-sm font-bold text-white">{userLevel}</span>
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
                Upgrade to Premium for ad-free learning and human mentorship
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
                    Premium Subscription
                  </DialogTitle>
                  <DialogDescription>
                    Unlock the full potential of your learning journey
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <VolumeX className="h-4 w-4 text-primary" />
                        <span>Ad-free Experience</span>
                      </div>
                      <Badge variant="secondary">Included</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MessageCircle className="h-4 w-4 text-primary" />
                        <span>Human Mentor Support</span>
                      </div>
                      <Badge variant="secondary">Included</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span>Priority AI Recommendations</span>
                      </div>
                      <Badge variant="secondary">Included</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Trophy className="h-4 w-4 text-primary" />
                        <span>Exclusive NFT Certificates</span>
                      </div>
                      <Badge variant="secondary">Included</Badge>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold nebula-text">$29.99/month</div>
                    <p className="text-sm text-muted-foreground">Cancel anytime</p>
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
                    Start Premium Trial
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
          {/* Hero Section */}
          <section className="text-center space-y-6">
            <div className="floating-animation">
              <h2 className="text-5xl font-bold nebula-text mb-4">
                Welcome to the Knowledge Universe
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Experience AI-powered personalized learning with blockchain technology. 
                Build skills, earn tokens, and join the decentralized education revolution.
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="cosmic-glow">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Learning
              </Button>
              <Button size="lg" variant="outline" className="border-primary/20 hover:border-primary/40">
                <TreePine className="mr-2 h-5 w-5" />
                Explore Skill Tree
              </Button>
            </div>
          </section>

          {/* Token Economy Stats */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="cosmic-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Coins className="mr-2 h-5 w-5 text-accent" />
                    $EDU Token Economics
                  </div>
                  <Badge variant="outline">Learning Rewards</Badge>
                </CardTitle>
                <CardDescription>
                  Fixed supply capped at 21 million tokens forever
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Circulating Supply</span>
                    <span className="text-accent">{EDU_CIRCULATION.toLocaleString()}</span>
                  </div>
                  <Progress value={(EDU_CIRCULATION / MAX_SUPPLY) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{((EDU_CIRCULATION / MAX_SUPPLY) * 100).toFixed(1)}% in circulation</span>
                    <span>Max: 21M</span>
                  </div>
                </div>
                <div className="text-center p-3 rounded-lg bg-accent/10">
                  <div className="text-lg font-semibold text-accent">Your Balance</div>
                  <div className="text-2xl font-bold">{eduTokens.toLocaleString()} $EDU</div>
                </div>
              </CardContent>
            </Card>

            <Card className="cosmic-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-primary" />
                    $LINK Token Economics
                  </div>
                  <Badge variant="outline">Community Contribution</Badge>
                </CardTitle>
                <CardDescription>
                  Fixed supply with quadrennial community voting for increases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Supply</span>
                    <span className="text-primary">{LINK_CIRCULATION.toLocaleString()}</span>
                  </div>
                  <Progress value={(LINK_CIRCULATION / MAX_SUPPLY) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Next vote: {NEXT_VOTE_YEAR}</span>
                    <span>Current cap: 21M</span>
                  </div>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Vote className="mr-2 h-4 w-4" />
                      View Voting System
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="cosmic-border">
                    <DialogHeader>
                      <DialogTitle className="nebula-text">$LINK Supply Voting Mechanism</DialogTitle>
                      <DialogDescription>
                        Community votes every 4 years to potentially increase LINK supply
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="text-center p-4 rounded-lg bg-primary/10">
                        <div className="text-sm text-muted-foreground mb-2">Next Voting Period</div>
                        <div className="text-2xl font-bold text-primary">{NEXT_VOTE_YEAR}</div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold">Voting Options for Supply Increase:</h4>
                        {VOTE_OPTIONS.map((option, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <span>Increase by {option.toLocaleString()} tokens</span>
                            <Badge variant="secondary">
                              {((option / LINK_CIRCULATION) * 100).toFixed(1)}% increase
                            </Badge>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-center p-3 rounded-lg bg-primary/10">
                        <div className="text-lg font-semibold text-primary">Your Balance</div>
                        <div className="text-2xl font-bold">{linkTokens.toLocaleString()} $LINK</div>
                        <div className="text-sm text-muted-foreground">Voting power in next election</div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </section>

          {/* Main Tabs Interface */}
          <section>
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-4 cosmic-border">
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary/20">
                  <Brain className="mr-2 h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="skills" className="data-[state=active]:bg-primary/20">
                  <TreePine className="mr-2 h-4 w-4" />
                  Skill Tree
                </TabsTrigger>
                <TabsTrigger value="learn" className="data-[state=active]:bg-primary/20">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Learn
                </TabsTrigger>
                <TabsTrigger value="earn" className="data-[state=active]:bg-primary/20">
                  <Coins className="mr-2 h-4 w-4" />
                  Earn Tokens
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Stats Dashboard */}
                  <Card className="cosmic-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">78%</div>
                      <Progress value={78} className="mt-2" />
                      <p className="text-xs text-muted-foreground mt-2">+12% from last week</p>
                    </CardContent>
                  </Card>

                  <Card className="cosmic-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Skills Mastered</CardTitle>
                      <Star className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-accent">24</div>
                      <p className="text-xs text-muted-foreground">Across 8 disciplines</p>
                    </CardContent>
                  </Card>

                  <Card className="cosmic-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">NFT Certificates</CardTitle>
                      <Shield className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">8</div>
                      <p className="text-xs text-muted-foreground">Verified on blockchain</p>
                    </CardContent>
                  </Card>

                  <Card className="cosmic-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Community Rank</CardTitle>
                      <Trophy className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-accent">#127</div>
                      <p className="text-xs text-muted-foreground">Top 5% of learners</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Premium Features Preview */}
                {isPremium && (
                  <Card className="cosmic-border bg-gradient-to-r from-accent/5 to-primary/5">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Crown className="mr-2 h-5 w-5 text-accent" />
                        Premium Features Active
                      </CardTitle>
                      <CardDescription>
                        You have access to exclusive premium learning tools
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                          <MessageCircle className="h-8 w-8 text-primary" />
                          <div>
                            <div className="font-semibold">Human Mentor</div>
                            <div className="text-sm text-muted-foreground">Available 24/7</div>
                          </div>
                          <Button size="sm" variant="outline">Connect</Button>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                          <Volume2 className="h-8 w-8 text-accent" />
                          <div>
                            <div className="font-semibold">Ad-free Learning</div>
                            <div className="text-sm text-muted-foreground">Uninterrupted focus</div>
                          </div>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="skills" className="space-y-6 mt-8">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold nebula-text">Interactive Skill Tree Universe</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Navigate your learning journey through interconnected skill nodes across multiple disciplines
                  </p>
                </div>
                
                {/* 3D Skill Tree Component */}
                <SkillTree userLevel={userLevel} />
              </TabsContent>

              <TabsContent value="learn" className="space-y-6 mt-8">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold nebula-text">Adaptive Learning Modules</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Content dynamically adapts to your learning style and progress
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: "Mathematics Fundamentals", type: "Interactive", progress: 75, difficulty: "Beginner", icon: Calculator },
                    { title: "World Languages", type: "Conversation", progress: 45, difficulty: "Intermediate", icon: Globe },
                    { title: "Programming Logic", type: "Hands-on", progress: 20, difficulty: "Advanced", icon: Code },
                    { title: "Geography & Culture", type: "Visual", progress: 90, difficulty: "Beginner", icon: Globe },
                    { title: "Music Theory", type: "Audio", progress: 60, difficulty: "Intermediate", icon: Music },
                    { title: "Digital Art", type: "Creative", progress: 30, difficulty: "Advanced", icon: Palette },
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
                          <CardDescription>{module.type} Learning</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <Progress value={module.progress} className="h-2" />
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{module.progress}% Complete</span>
                              <span className="text-primary">Continue Learning</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="earn" className="space-y-6 mt-8">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold nebula-text">Tokenized Knowledge Economy</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Earn $EDU tokens for learning and $LINK tokens for community contributions
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="cosmic-border">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Coins className="mr-2 h-5 w-5 text-accent" />
                        $EDU Learning Rewards
                      </CardTitle>
                      <CardDescription>
                        Capped at 21M tokens • Earn by completing modules
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-3xl font-bold text-accent">{eduTokens.toLocaleString()}</div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Daily Goal</span>
                          <span className="text-sm text-accent">50 $EDU</span>
                        </div>
                        <Progress value={75} className="h-2" />
                        <p className="text-xs text-muted-foreground">37/50 tokens earned today</p>
                      </div>
                      <Button className="w-full" variant="outline">
                        View Earning History
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cosmic-border">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Zap className="mr-2 h-5 w-5 text-primary" />
                        $LINK Contribution Tokens
                      </CardTitle>
                      <CardDescription>
                        Community tokens • Earn by helping others learn
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-3xl font-bold text-primary">{linkTokens.toLocaleString()}</div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Weekly Goal</span>
                          <span className="text-sm text-primary">200 $LINK</span>
                        </div>
                        <Progress value={60} className="h-2" />
                        <p className="text-xs text-muted-foreground">120/200 tokens earned this week</p>
                      </div>
                      <Button className="w-full" variant="outline">
                        <Vote className="mr-2 h-4 w-4" />
                        Voting Power: {linkTokens.toLocaleString()}
                      </Button>
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