import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { Badge } from './components/ui/badge'
import { Progress } from './components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
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
  Gamepad2
} from 'lucide-react'

function App() {
  const [userLevel, setUserLevel] = useState(12)
  const [eduTokens, setEduTokens] = useState(1247)
  const [linkTokens, setLinkTokens] = useState(892)

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
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="cosmic-border">
                <Coins className="mr-1 h-3 w-3 text-accent" />
                {eduTokens} $EDU
              </Badge>
              <Badge variant="secondary" className="cosmic-border">
                <Zap className="mr-1 h-3 w-3 text-primary" />
                {linkTokens} $LINK
              </Badge>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center cosmic-glow">
              <span className="text-sm font-bold text-white">{userLevel}</span>
            </div>
          </div>
        </div>
      </header>

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

          {/* Stats Dashboard */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <p className="text-xs text-muted-foreground">Across 6 disciplines</p>
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
          </section>

          {/* Main Tabs Interface */}
          <section>
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-4 cosmic-border">
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary/20">
                  <Brain className="mr-2 h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="learn" className="data-[state=active]:bg-primary/20">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Learn
                </TabsTrigger>
                <TabsTrigger value="skills" className="data-[state=active]:bg-primary/20">
                  <TreePine className="mr-2 h-4 w-4" />
                  Skill Tree
                </TabsTrigger>
                <TabsTrigger value="earn" className="data-[state=active]:bg-primary/20">
                  <Coins className="mr-2 h-4 w-4" />
                  Earn Tokens
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* AI Gnosis Engine */}
                  <Card className="cosmic-border">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Brain className="mr-2 h-5 w-5 text-primary" />
                        Gnosis AI Engine
                      </CardTitle>
                      <CardDescription>
                        Personalized learning recommendations based on your cognitive profile
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Visual Learning</span>
                          <span className="text-primary">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Auditory Learning</span>
                          <span className="text-accent">72%</span>
                        </div>
                        <Progress value={72} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Kinesthetic Learning</span>
                          <span className="text-primary">68%</span>
                        </div>
                        <Progress value={68} className="h-2" />
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Get AI Recommendations
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="cosmic-border">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Gamepad2 className="mr-2 h-5 w-5 text-accent" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription>
                        Your latest learning achievements and token rewards
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <Star className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">JavaScript Mastery</p>
                            <p className="text-xs text-muted-foreground">Completed skill node</p>
                          </div>
                        </div>
                        <Badge variant="secondary">+50 $EDU</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                            <Trophy className="h-4 w-4 text-accent" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">AI Algorithms NFT</p>
                            <p className="text-xs text-muted-foreground">Earned certificate</p>
                          </div>
                        </div>
                        <Badge variant="secondary">+25 $LINK</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Community Contribution</p>
                            <p className="text-xs text-muted-foreground">Helped peer learner</p>
                          </div>
                        </div>
                        <Badge variant="secondary">+15 $LINK</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
                    { title: "Blockchain Fundamentals", type: "Video", progress: 75, difficulty: "Beginner" },
                    { title: "AI Machine Learning", type: "Interactive", progress: 45, difficulty: "Intermediate" },
                    { title: "Smart Contract Development", type: "Hands-on", progress: 20, difficulty: "Advanced" },
                    { title: "Tokenomics Deep Dive", type: "Podcast", progress: 90, difficulty: "Intermediate" },
                    { title: "DAO Governance", type: "Infographic", progress: 60, difficulty: "Beginner" },
                    { title: "DeFi Protocols", type: "Video", progress: 30, difficulty: "Advanced" },
                  ].map((module, i) => (
                    <Card key={i} className="cosmic-border hover:cosmic-glow transition-all cursor-pointer">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{module.title}</CardTitle>
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
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="skills" className="space-y-6 mt-8">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold nebula-text">3D Skill Tree Universe</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Navigate your learning journey through interconnected skill nodes
                  </p>
                </div>
                
                {/* Skill Tree Placeholder - Will be enhanced with Three.js later */}
                <Card className="cosmic-border h-96 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="pulse-glow rounded-full bg-gradient-to-r from-primary to-accent p-8 mx-auto w-fit">
                      <TreePine className="h-12 w-12 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold nebula-text">3D Skill Tree Coming Soon</h4>
                    <p className="text-muted-foreground max-w-md">
                      Interactive Three.js visualization will show your skill progression across disciplines
                    </p>
                    <Button className="cosmic-glow">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Preview Skill Pathways
                    </Button>
                  </div>
                </Card>
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
                        Fixed supply of 21M tokens • Earn by completing modules
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
                        Governance tokens • Earn by helping community
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
                        DAO Governance
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