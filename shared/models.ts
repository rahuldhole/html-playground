export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export const MODELS = {
  COBUDDY: {
    id: "baidu/cobuddy:free",
    name: "CoBuddy",
    description: "Reliable model from Baidu",
    icon: "lucide:bot"
  },
  MINIMAX_M25: {
    id: "minimax/minimax-m2.5:free",
    name: "MiniMax M2.5",
    description: "High-performance model",
    icon: "lucide:zap"
  },
  TRINITY_LARGE_THINKING: {
    id: "arcee-ai/trinity-large-thinking:free",
    name: "Trinity Large",
    description: "Excellent for complex reasoning",
    icon: "lucide:brain-circuit"
  },
  GLM_45_AIR: {
    id: "z-ai/glm-4.5-air:free",
    name: "GLM 4.5 Air",
    description: "Balanced performance and speed",
    icon: "lucide:wind"
  },
  LAGUNA_M1: {
    id: "poolside/laguna-m.1:free",
    name: "Laguna M.1",
    description: "Specialized for code generation",
    icon: "lucide:code-2"
  },
  GEMMA_31B: {
    id: "google/gemma-4-31b-it:free",
    name: "Gemma 31B",
    description: "Google's powerful open model",
    icon: "simple-icons:google"
  },
  GEMMA_26B: {
    id: "google/gemma-4-26b-a4b-it:free",
    name: "Gemma 26B",
    description: "Fast Google model",
    icon: "simple-icons:google"
  },
  GPT_OSS_120B: {
    id: "openai/gpt-oss-120b:free",
    name: "GPT OSS 120B",
    description: "Large scale open source model",
    icon: "simple-icons:openai"
  },
  DEEPSEEK_V4_FLASH: {
    id: "deepseek/deepseek-v4-flash:free",
    name: "DeepSeek V4 Flash",
    description: "Ultra-fast and efficient",
    icon: "lucide:gauge"
  },
  NEMOTRON_120B: {
    id: "nvidia/nemotron-3-super-120b-a12b:free",
    name: "Nemotron 120B",
    description: "NVIDIA's flagship open model",
    icon: "simple-icons:nvidia"
  },
  RANDOM: {
    id: "openrouter/free",
    name: "Random Model",
    description: "Uses any available model",
    icon: "lucide:shuffle"
  },
} as const;

export type ModelKey = keyof typeof MODELS;
export type ModelId = typeof MODELS[ModelKey]["id"];
export const DEFAULT_MODEL = MODELS.COBUDDY.id;
