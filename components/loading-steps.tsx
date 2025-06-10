import { Youtube, Brain, Sparkles, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingStep {
  key: string
  icon: any
  text: string
  color: string
}

interface LoadingStepsProps {
  currentStep: string
}

const steps: LoadingStep[] = [
  { key: "fetching", icon: Youtube, text: "Fetching video information...", color: "from-blue-500 to-blue-600" },
  { key: "analyzing", icon: Brain, text: "Analyzing video content...", color: "from-purple-500 to-purple-600" },
  { key: "summarizing", icon: Sparkles, text: "Generating AI summary...", color: "from-pink-500 to-pink-600" },
  { key: "translating", icon: Globe, text: "Translating content...", color: "from-green-500 to-green-600" },
]

export default function LoadingSteps({ currentStep }: LoadingStepsProps) {
  return (
    <div className="space-y-4">
      {steps.map((step) => {
        const isActive = step.key === currentStep
        const isCompleted = steps.findIndex((s) => s.key === currentStep) > steps.findIndex((s) => s.key === step.key)
        const Icon = step.icon

        return (
          <div
            key={step.key}
            className={cn(
              "flex items-center gap-3 p-4 rounded-lg transition-all duration-300",
              isActive ? `bg-gradient-to-r ${step.color} text-white` : "bg-muted",
              isCompleted && "opacity-50"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-muted-foreground")} />
            <span className={cn("text-sm", isActive ? "text-white" : "text-muted-foreground")}>{step.text}</span>
            {isActive && (
              <div className="ml-auto">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
} 