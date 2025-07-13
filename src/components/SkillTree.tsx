import { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { 
  Calculator, 
  Globe, 
  Code, 
  Music, 
  Palette, 
  Atom, 
  BookOpen, 
  Brain,
  Lock,
  Unlock,
  Star,
  Trophy,
  Zap
} from 'lucide-react'

interface SkillNode {
  id: string
  name: string
  category: string
  icon: any
  level: number
  maxLevel: number
  unlocked: boolean
  position: { x: number; y: number }
  connections: string[]
  description: string
  color: string
}

interface SkillTreeProps {
  userLevel: number
}

const SkillTree = ({ userLevel }: SkillTreeProps) => {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  // Define skill nodes in a circular arrangement
  const skillNodes: SkillNode[] = [
    // Mathematics branch (top)
    {
      id: 'math-basic',
      name: 'Basic Math',
      category: 'Mathematics',
      icon: Calculator,
      level: 3,
      maxLevel: 5,
      unlocked: true,
      position: { x: 50, y: 10 },
      connections: ['math-algebra', 'math-geometry'],
      description: 'Foundation of mathematical thinking',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'math-algebra',
      name: 'Algebra',
      category: 'Mathematics',
      icon: Calculator,
      level: 2,
      maxLevel: 5,
      unlocked: true,
      position: { x: 35, y: 25 },
      connections: ['math-calculus'],
      description: 'Advanced mathematical operations',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'math-geometry',
      name: 'Geometry',
      category: 'Mathematics',
      icon: Calculator,
      level: 1,
      maxLevel: 5,
      unlocked: true,
      position: { x: 65, y: 25 },
      connections: ['math-calculus'],
      description: 'Spatial reasoning and shapes',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'math-calculus',
      name: 'Calculus',
      category: 'Mathematics',
      icon: Calculator,
      level: 0,
      maxLevel: 5,
      unlocked: false,
      position: { x: 50, y: 40 },
      connections: ['physics-basic'],
      description: 'Advanced mathematical analysis',
      color: 'from-blue-400 to-blue-600'
    },
    
    // Languages branch (right)
    {
      id: 'lang-english',
      name: 'English',
      category: 'Languages',
      icon: Globe,
      level: 4,
      maxLevel: 5,
      unlocked: true,
      position: { x: 85, y: 35 },
      connections: ['lang-spanish', 'literature'],
      description: 'Global communication language',
      color: 'from-green-400 to-green-600'
    },
    {
      id: 'lang-spanish',
      name: 'Spanish',
      category: 'Languages',
      icon: Globe,
      level: 2,
      maxLevel: 5,
      unlocked: true,
      position: { x: 90, y: 50 },
      connections: ['lang-french'],
      description: 'Romance language mastery',
      color: 'from-green-400 to-green-600'
    },
    {
      id: 'lang-french',
      name: 'French',
      category: 'Languages',
      icon: Globe,
      level: 1,
      maxLevel: 5,
      unlocked: userLevel >= 10,
      position: { x: 85, y: 65 },
      connections: ['literature'],
      description: 'Elegant European language',
      color: 'from-green-400 to-green-600'
    },
    
    // Geography branch (bottom-right)
    {
      id: 'geo-continents',
      name: 'Continents',
      category: 'Geography',
      icon: Globe,
      level: 3,
      maxLevel: 5,
      unlocked: true,
      position: { x: 75, y: 80 },
      connections: ['geo-countries', 'cultures'],
      description: 'World geography fundamentals',
      color: 'from-amber-400 to-amber-600'
    },
    {
      id: 'geo-countries',
      name: 'Countries',
      category: 'Geography',
      icon: Globe,
      level: 2,
      maxLevel: 5,
      unlocked: true,
      position: { x: 60, y: 90 },
      connections: ['cultures'],
      description: 'National boundaries and capitals',
      color: 'from-amber-400 to-amber-600'
    },
    
    // Programming branch (bottom)
    {
      id: 'prog-basics',
      name: 'Programming Basics',
      category: 'Programming',
      icon: Code,
      level: 2,
      maxLevel: 5,
      unlocked: true,
      position: { x: 50, y: 85 },
      connections: ['prog-javascript', 'prog-python'],
      description: 'Fundamentals of coding',
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'prog-javascript',
      name: 'JavaScript',
      category: 'Programming',
      icon: Code,
      level: 1,
      maxLevel: 5,
      unlocked: true,
      position: { x: 35, y: 75 },
      connections: ['web-dev'],
      description: 'Web programming language',
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'prog-python',
      name: 'Python',
      category: 'Programming',
      icon: Code,
      level: 1,
      maxLevel: 5,
      unlocked: userLevel >= 8,
      position: { x: 25, y: 65 },
      connections: ['ai-basics'],
      description: 'Versatile programming language',
      color: 'from-purple-400 to-purple-600'
    },
    
    // Arts branch (left)
    {
      id: 'art-drawing',
      name: 'Drawing',
      category: 'Arts',
      icon: Palette,
      level: 2,
      maxLevel: 5,
      unlocked: true,
      position: { x: 15, y: 35 },
      connections: ['art-digital', 'music-theory'],
      description: 'Visual art fundamentals',
      color: 'from-pink-400 to-pink-600'
    },
    {
      id: 'art-digital',
      name: 'Digital Art',
      category: 'Arts',
      icon: Palette,
      level: 1,
      maxLevel: 5,
      unlocked: userLevel >= 6,
      position: { x: 10, y: 50 },
      connections: ['design'],
      description: 'Modern digital creativity',
      color: 'from-pink-400 to-pink-600'
    },
    
    // Music branch (left-center)
    {
      id: 'music-theory',
      name: 'Music Theory',
      category: 'Music',
      icon: Music,
      level: 1,
      maxLevel: 5,
      unlocked: true,
      position: { x: 25, y: 20 },
      connections: ['music-instrument'],
      description: 'Understanding musical structure',
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      id: 'music-instrument',
      name: 'Instrument Playing',
      category: 'Music',
      icon: Music,
      level: 0,
      maxLevel: 5,
      unlocked: false,
      position: { x: 15, y: 10 },
      connections: [],
      description: 'Musical performance skills',
      color: 'from-indigo-400 to-indigo-600'
    },
    
    // Science branch (center advanced nodes)
    {
      id: 'physics-basic',
      name: 'Physics',
      category: 'Science',
      icon: Atom,
      level: 0,
      maxLevel: 5,
      unlocked: false,
      position: { x: 50, y: 55 },
      connections: ['chemistry'],
      description: 'Laws of the physical world',
      color: 'from-red-400 to-red-600'
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      category: 'Science',
      icon: Atom,
      level: 0,
      maxLevel: 5,
      unlocked: false,
      position: { x: 65, y: 60 },
      connections: [],
      description: 'Matter and molecular interactions',
      color: 'from-red-400 to-red-600'
    },
    
    // Advanced interdisciplinary nodes
    {
      id: 'literature',
      name: 'Literature',
      category: 'Humanities',
      icon: BookOpen,
      level: 1,
      maxLevel: 5,
      unlocked: userLevel >= 8,
      position: { x: 75, y: 45 },
      connections: ['cultures'],
      description: 'Written artistic expression',
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      id: 'cultures',
      name: 'World Cultures',
      category: 'Humanities',
      icon: Globe,
      level: 0,
      maxLevel: 5,
      unlocked: false,
      position: { x: 70, y: 70 },
      connections: [],
      description: 'Understanding human societies',
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      id: 'ai-basics',
      name: 'AI Fundamentals',
      category: 'Technology',
      icon: Brain,
      level: 0,
      maxLevel: 5,
      unlocked: false,
      position: { x: 30, y: 50 },
      connections: [],
      description: 'Artificial intelligence concepts',
      color: 'from-cyan-400 to-cyan-600'
    },
    {
      id: 'web-dev',
      name: 'Web Development',
      category: 'Technology',
      icon: Code,
      level: 0,
      maxLevel: 5,
      unlocked: false,
      position: { x: 40, y: 65 },
      connections: ['design'],
      description: 'Building web applications',
      color: 'from-cyan-400 to-cyan-600'
    },
    {
      id: 'design',
      name: 'Design Principles',
      category: 'Creative',
      icon: Palette,
      level: 0,
      maxLevel: 5,
      unlocked: false,
      position: { x: 20, y: 60 },
      connections: [],
      description: 'Visual and UX design theory',
      color: 'from-rose-400 to-rose-600'
    }
  ]

  const categories = [
    { name: 'Mathematics', color: 'blue', count: skillNodes.filter(n => n.category === 'Mathematics').length },
    { name: 'Languages', color: 'green', count: skillNodes.filter(n => n.category === 'Languages').length },
    { name: 'Geography', color: 'amber', count: skillNodes.filter(n => n.category === 'Geography').length },
    { name: 'Programming', color: 'purple', count: skillNodes.filter(n => n.category === 'Programming').length },
    { name: 'Arts', color: 'pink', count: skillNodes.filter(n => n.category === 'Arts').length },
    { name: 'Music', color: 'indigo', count: skillNodes.filter(n => n.category === 'Music').length },
    { name: 'Science', color: 'red', count: skillNodes.filter(n => n.category === 'Science').length },
    { name: 'Humanities', color: 'yellow', count: skillNodes.filter(n => n.category === 'Humanities').length },
    { name: 'Technology', color: 'cyan', count: skillNodes.filter(n => n.category === 'Technology').length },
    { name: 'Creative', color: 'rose', count: skillNodes.filter(n => n.category === 'Creative').length },
  ]

  const renderConnection = (from: SkillNode, to: SkillNode) => {
    const toNode = skillNodes.find(n => n.id === to.id)
    if (!toNode) return null

    const fromX = from.position.x
    const fromY = from.position.y
    const toX = toNode.position.x
    const toY = toNode.position.y

    return (
      <line
        key={`${from.id}-${to.id}`}
        x1={`${fromX}%`}
        y1={`${fromY}%`}
        x2={`${toX}%`}
        y2={`${toY}%`}
        stroke="hsl(220 91% 65%)"
        strokeWidth="2"
        strokeOpacity="0.3"
        className="transition-all duration-300"
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Category Legend */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Badge 
            key={category.name} 
            variant="secondary" 
            className={`cosmic-border bg-${category.color}-500/10 border-${category.color}-500/20`}
          >
            {category.name} ({category.count})
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill Tree Visualization */}
        <div className="lg:col-span-2">
          <Card className="cosmic-border h-[600px] p-6">
            <div className="relative w-full h-full">
              {/* SVG for connections */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                {skillNodes.map(node => 
                  node.connections.map(connectionId => {
                    const connectedNode = skillNodes.find(n => n.id === connectionId)
                    return connectedNode ? renderConnection(node, connectedNode) : null
                  })
                )}
              </svg>

              {/* Skill Nodes */}
              {skillNodes.map((node) => {
                const IconComponent = node.icon
                const isSelected = selectedNode?.id === node.id
                const isHovered = hoveredNode === node.id
                
                return (
                  <div
                    key={node.id}
                    className={`absolute transition-all duration-300 cursor-pointer skill-node ${
                      isSelected ? 'scale-125 z-20' : isHovered ? 'scale-110 z-10' : 'z-5'
                    }`}
                    style={{
                      left: `${node.position.x}%`,
                      top: `${node.position.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onClick={() => setSelectedNode(node)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <div 
                      className={`
                        relative w-16 h-16 rounded-full flex items-center justify-center
                        ${node.unlocked 
                          ? `bg-gradient-to-br ${node.color} cosmic-glow` 
                          : 'bg-muted border-2 border-muted-foreground/20'
                        }
                        ${isSelected ? 'ring-4 ring-primary/50' : ''}
                        ${isHovered ? 'shadow-lg' : ''}
                      `}
                    >
                      {node.unlocked ? (
                        <IconComponent className="h-6 w-6 text-white" />
                      ) : (
                        <Lock className="h-6 w-6 text-muted-foreground" />
                      )}
                      
                      {/* Level indicator */}
                      {node.unlocked && node.level > 0 && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-xs font-bold flex items-center justify-center text-black">
                          {node.level}
                        </div>
                      )}
                      
                      {/* Max level star */}
                      {node.level === node.maxLevel && (
                        <div className="absolute -top-1 -left-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        </div>
                      )}
                    </div>
                    
                    {/* Node name */}
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-xs text-center whitespace-nowrap">
                      <div className={`font-medium ${node.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {node.name}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Skill Details Panel */}
        <div className="space-y-6">
          {selectedNode ? (
            <Card className="cosmic-border">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${selectedNode.color} flex items-center justify-center`}>
                    <selectedNode.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedNode.name}</h3>
                    <Badge variant="outline">{selectedNode.category}</Badge>
                  </div>
                </div>

                <p className="text-muted-foreground">{selectedNode.description}</p>

                {selectedNode.unlocked ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-primary">
                        Level {selectedNode.level}/{selectedNode.maxLevel}
                      </span>
                    </div>
                    <Progress 
                      value={(selectedNode.level / selectedNode.maxLevel) * 100} 
                      className="h-2" 
                    />
                    
                    {selectedNode.level < selectedNode.maxLevel ? (
                      <Button className="w-full cosmic-glow" size="sm">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Continue Learning
                      </Button>
                    ) : (
                      <div className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-accent/10">
                        <Trophy className="h-5 w-5 text-accent" />
                        <span className="font-semibold text-accent">Mastered!</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Unlock at Level {userLevel < 15 ? userLevel + 2 : 15}
                      </span>
                    </div>
                    <Button variant="outline" className="w-full" disabled>
                      <Zap className="mr-2 h-4 w-4" />
                      Requirements Not Met
                    </Button>
                  </div>
                )}

                {/* Prerequisites */}
                {selectedNode.connections.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Unlocks:</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedNode.connections.map(connectionId => {
                        const connectedNode = skillNodes.find(n => n.id === connectionId)
                        return connectedNode ? (
                          <Badge 
                            key={connectionId} 
                            variant="secondary" 
                            className="text-xs cursor-pointer hover:bg-primary/20"
                            onClick={() => setSelectedNode(connectedNode)}
                          >
                            {connectedNode.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="cosmic-border">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mx-auto cosmic-glow">
                  <TreePine className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Interactive Skill Tree</h3>
                  <p className="text-muted-foreground text-sm">
                    Click on any skill node to view details and track your learning progress across disciplines.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card className="cosmic-border">
            <CardContent className="p-6 space-y-4">
              <h4 className="font-semibold">Your Progress</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Skills Unlocked</span>
                  <span className="text-sm font-semibold text-primary">
                    {skillNodes.filter(n => n.unlocked).length}/{skillNodes.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Skills Mastered</span>
                  <span className="text-sm font-semibold text-accent">
                    {skillNodes.filter(n => n.level === n.maxLevel).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Level</span>
                  <span className="text-sm font-semibold text-primary">{userLevel}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SkillTree