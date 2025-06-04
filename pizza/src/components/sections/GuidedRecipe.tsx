/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { app } from '../../lib/firebase';
import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  SchemaType,
} from 'firebase/ai';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '../ui/carousel';
import { Clock, Send, Lightbulb, CheckCircle } from 'lucide-react';
import type { Recipe, MeasuredIngredient } from '@cs394-vite-nx-template/shared';

interface GuidedRecipeProps {
  recipe?: Recipe;
  recipeId?: string;
  stepSetter?: React.Dispatch<React.SetStateAction<number>>;
  missingIngredients?: MeasuredIngredient[];
}

interface DetailedStep {
  title: string;
  description: string;
  tips: string[];
  estimatedTime: number; // in minutes
  suggestedQuestions: string[];
}

export const GuidedRecipe: React.FC<GuidedRecipeProps> = ({
  recipe,
  recipeId,
  stepSetter,
  missingIngredients = []
}) => {
  const [detailedSteps, setDetailedSteps] = useState<DetailedStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carousel state
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Chatbot state
  const [userQuestion, setUserQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<
    Array<{
      type: 'user' | 'model';
      message: string;
      timestamp: Date;
    }>
  >([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const ai = getAI(app, { backend: new GoogleAIBackend() });

  // Define response schema for structured output
  const detailedStepsSchema = {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        title: {
          type: SchemaType.STRING,
          description:
            'A clear, concise title for the cooking step (3-5 words)',
        },
        description: {
          type: SchemaType.STRING,
          description:
            'Detailed description of the cooking step with specific techniques',
        },
        tips: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.STRING,
          },
          description: 'Array of 2-3 practical cooking tips for this step',
        },
        estimatedTime: {
          type: SchemaType.NUMBER,
          description: 'Estimated time to complete this step in minutes',
        },
        suggestedQuestions: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.STRING,
          },
          description:
            'Array of 3 common questions beginners might ask about this step',
        },
      },
      required: [
        'title',
        'description',
        'tips',
        'estimatedTime',
        'suggestedQuestions',
      ],
    },
  };

  const getModel = useCallback(
    () =>
      getGenerativeModel(ai, {
        model: 'gemini-2.0-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: detailedStepsSchema,
        },
      }),
    [recipe]
  );

  const model = getModel();

  const getTextModel = useCallback(
    () =>
      getGenerativeModel(ai, {
        model: 'gemini-2.0-flash',
      }),
    []
  );
  const textModel = getTextModel();

  const createFallbackSteps = useCallback(() => {
    if (!recipe) return;

    const fallbackSteps: DetailedStep[] = recipe.instructions.map(
      (instruction, index) => ({
        title: `Step ${index + 1}`,
        description: instruction,
        tips: [
          'Take your time with this step',
          'Ensure all ingredients are at room temperature',
          'Keep your workspace clean and organized',
        ],
        estimatedTime: 10,
        suggestedQuestions: [
          'How do I know when this step is complete?',
          'What should I do if something goes wrong?',
          'Can I prepare this step in advance?',
        ],
      })
    );

    setDetailedSteps(fallbackSteps);
  }, [recipe]);

  const generateDetailedSteps = useCallback(async () => {
    if (!recipe) return;

    console.log(`"MISSING INGREDIENTS: ${missingIngredients.map(ing => `${ing.amount} ${ing.unit} ${ing.ingredient.name}`).join(', ')}"`);

    setIsLoading(true);
    try {
      // Build missing ingredients context
      const missingIngredientsText = missingIngredients.length > 0
        ? `\n\nMISSING INGREDIENTS: ${missingIngredients.map(ing => `${ing.amount} ${ing.unit} ${ing.ingredient.name}`).join(', ')}\n\nIMPORTANT: The cook is missing these ingredients. For any step that requires these missing ingredients, provide alternative techniques, substitution suggestions, or modified instructions that work around these missing items. Be creative and practical with adaptations.`
        : '';

      const prompt = `
        You are an expert cooking instructor. Given this recipe, create detailed cooking steps with tips and suggested questions.

        Recipe: ${recipe.name}
        Description: ${recipe.description}
        Instructions: ${recipe.instructions.join('. ')}
        Ingredients: ${recipe.ingredients
          .map((ing) => `${ing.amount} ${ing.unit} ${ing.ingredient.name}`)
          .join(', ')}${missingIngredientsText}

        For each instruction step, provide:
        1. A clear title (3-5 words)
        2. Detailed description with specific techniques${missingIngredients.length > 0 ? ' (include adaptations for missing ingredients where applicable)' : ''}
        3. 2-3 practical tips${missingIngredients.length > 0 ? ' (include substitution or workaround tips for missing ingredients). make sure to note what changes you made to the recipe, because of missing ingredients, here' : ''}
        4. Estimated time in minutes
        5. 3 common questions beginners might ask about this step${missingIngredients.length > 0 ? ' (include questions about ingredient substitutions)' : ''}

        Return a JSON array of detailed steps following the provided schema.
      `;

      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const responseText = response.text().replace(/\*\*/g, ''); // Remove any Markdown bold formatting

      const parsedSteps: DetailedStep[] = JSON.parse(responseText);

      if (Array.isArray(parsedSteps) && parsedSteps.length > 0) {
        const validSteps = parsedSteps.filter(
          (step) =>
            step.title &&
            step.description &&
            Array.isArray(step.tips) &&
            typeof step.estimatedTime === 'number' &&
            Array.isArray(step.suggestedQuestions)
        );

        if (validSteps.length > 0) {
          setDetailedSteps(validSteps);
        } else {
          throw new Error('No valid steps found in AI response');
        }
      } else {
        throw new Error('Invalid JSON structure from AI response');
      }
    } catch (error) {
      console.error('Error generating detailed steps:', error);
      createFallbackSteps();
    } finally {
      setIsLoading(false);
    }
  }, [recipe, model, createFallbackSteps, missingIngredients]);

  const handleQuestionSelect = async (question: string) => {
    // Add the question to chat history as user message first
    setChatHistory((prev) => [
      ...prev,
      {
        type: 'user',
        message: question,
        timestamp: new Date(),
      },
    ]);

    setIsTyping(true);

    try {
      const currentStep = detailedSteps[currentStepIndex];

      // Build conversation context with current chat history
      const conversationHistory = chatHistory.map((msg) => msg.message);

      const systemPrompt = `You are an expert cooking instructor. A student is working on "${
        currentStep?.title || 'this step'
      }" step of making "${recipe?.name}".

Current step: ${currentStep?.description || 'No step description available'}

Provide helpful, detailed answers that address their specific concerns. Be encouraging and practical. Keep responses conversational and reference previous parts of the conversation when relevant. Do not use Markdown formatting, including bold, italics, or code blocks. They are not supported in this chat interface.`;

      const result = await textModel.generateContent([
        systemPrompt,
        ...conversationHistory,
        question,
      ]);
      const response = await result.response;

      // Add AI response to chat
      setChatHistory((prev) => [
        ...prev,
        {
          type: 'model',
          message: response.text().replace(/\*\*/g, ''),
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error generating question response:', error);
      setChatHistory((prev) => [
        ...prev,
        {
          type: 'model',
          message:
            "I apologize, but I'm having trouble answering that right now. Please try asking again or consult the recipe instructions.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (message?: string) => {
    const questionToSend = message || userQuestion.trim();
    if (!questionToSend) return;

    setChatHistory((prev) => [
      ...prev,
      {
        type: 'user',
        message: questionToSend,
        timestamp: new Date(),
      },
    ]);

    setUserQuestion('');
    setIsTyping(true);

    try {
      const currentStep = detailedSteps[currentStepIndex];

      // Build conversation context with current chat history
      const conversationHistory = chatHistory.map((msg) => msg.message);

      // Build missing ingredients context for chatbot
      const missingIngredientsContext = missingIngredients.length > 0
        ? `\n\nIMPORTANT: The student is missing these ingredients: ${missingIngredients.map(ing => `${ing.amount} ${ing.unit} ${ing.ingredient.name}`).join(', ')}. If they ask about substitutions or alternatives, provide practical suggestions for these missing items.`
        : '';

      const systemPrompt = `You are an expert cooking instructor. A student is working on "${
        currentStep?.title || 'this step'
      }" step of making "${recipe?.name}".

Current step: ${currentStep?.description || 'No step description available'}${missingIngredientsContext}

Provide helpful, detailed answers that address their specific concerns. Be encouraging and practical. Keep responses conversational and reference previous parts of the conversation when relevant. Do not use Markdown formatting, including bold, italics, or code blocks. They are not supported in this chat interface.`;

      const result = await textModel.generateContent([
        systemPrompt,
        ...conversationHistory,
        questionToSend,
      ]);
      const response = await result.response;

      // Add AI response to chat
      setChatHistory((prev) => [
        ...prev,
        {
          type: 'model',
          message: response.text(),
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error generating question response:', error);
      setChatHistory((prev) => [
        ...prev,
        {
          type: 'model',
          message:
            "I apologize, but I'm having trouble answering that right now. Please try asking again or consult the recipe instructions.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Track carousel changes
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentStepIndex(carouselApi.selectedScrollSnap());
      stepSetter?.(carouselApi.selectedScrollSnap());
    };

    carouselApi.on('select', onSelect);
    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (recipe) {
      generateDetailedSteps();
      stepSetter?.(0);
    }
  }, [recipe]);

  // Add suggested questions to chat when step changes
  useEffect(() => {
    if (detailedSteps.length > 0 && currentStepIndex < detailedSteps.length) {
      const currentStep = detailedSteps[currentStepIndex];
      if (currentStep.suggestedQuestions.length > 0) {
        // Clear chat when moving to a new step
        setChatHistory([]);
        // Set suggested questions for display
        setSuggestedQuestions(currentStep.suggestedQuestions);
      }
    }
  }, [currentStepIndex, detailedSteps]);

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-semibold text-gray-600">
          No recipe provided
        </h2>
        <p className="text-gray-500">
          Please select a recipe to get guided cooking instructions.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        <h2 className="text-xl font-semibold">
          Sensei is preparing your personalized cooking guide...
        </h2>
        <p className="text-gray-600">
          This may take a moment as I analyze your recipe.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[90vh] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
      {/* Header with Progress
      <div className="bg-white border-b shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="px-3 py-1 text-sm font-medium"
            >
              Step {currentStepIndex + 1} of {detailedSteps.length}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">
              {detailedSteps.length - currentStepIndex - 1 === 0
                ? 'Final Step!'
                : `${
                    detailedSteps.length - currentStepIndex - 1
                  } steps remaining`}
            </div>
          </div>
        </div>
      </div> */}

      {/* Carousel Section */}
      <div className="flex-1 overflow-hidden p-6 bg-card">
        <Carousel
          setApi={setCarouselApi}
          className="w-full h-full"
          opts={{
            align: 'start',
            loop: false,
          }}
        >
          <CarouselContent className="h-full bg-card">
            {detailedSteps.map((step, index) => (
              <CarouselItem key={index} className="h-full ">
                <Card className="h-full flex flex-col justify-baseline bg-white shadow-lg border">
                  <CardHeader className="">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <CheckCircle
                          className={`w-6 h-6 ${
                            index < currentStepIndex
                              ? 'text-green-500'
                              : index === currentStepIndex
                              ? 'text-accent'
                              : 'text-gray-300'
                          }`}
                        />
                        {step.title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 px-3 py-1"
                      >
                        <Clock className="w-4 h-4" />~{step.estimatedTime} min
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-6">
                    {/* Step Description */}
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {step.description}
                      </p>
                    </div>

                    {/* Tips Section */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-3 text-accent flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        Sensei's Pro Tips
                      </h4>
                      <ul className=" items-center">
                        {step.tips.map((tip, tipIndex) => (
                          <li
                            key={tipIndex}
                            className="text-sm text-gray-700 flex items-center gap-2"
                          >
                            <span className="text-accent mt-1 text-lg">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-gray-300 shadow-lg" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-gray-300 shadow-lg" />
        </Carousel>
      </div>

      {/* Compact Chatbot Interface */}
      <div className="bg-white border-t shadow-lg">
        {chatHistory.length === 0 && (
          <div className="border-b bg-accent/5 p-3 w-full">
            <div className="flex flex-row overflow-x-auto justify-around">
              {suggestedQuestions.slice(0, 3).map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuestionSelect(question)}
                  className="text-left h-auto p-3 min-w-0 flex-shrink-0 bg-accent/10 border-accent/30 hover:bg-accent/20 text-accent text-sm"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border-t shadow-lg">
        {/* Compact Chat Messages - Only show actual conversations */}
        {chatHistory.length > 0 && (
          <div className="max-h-32 overflow-y-auto p-2 space-y-1">
            {chatHistory
              .slice(-4) // Show last 4 messages to allow more conversation
              .map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded text-sm leading-relaxed ${
                      message.type === 'user'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p>{message.message}</p>
                  </div>
                </div>
              ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  <div className="flex items-center space-x-1">
                    <div className="animate-bounce w-1 h-1 bg-gray-500 rounded-full"></div>
                    <div
                      className="animate-bounce w-1 h-1 bg-gray-500 rounded-full"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="animate-bounce w-1 h-1 bg-gray-500 rounded-full"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input Area */}
        <div className="p-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <Input
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="Ask about this step..."
              className="flex-1 bg-white h-8 text-sm"
              disabled={isTyping}
            />
            <Button
              type="submit"
              disabled={!userQuestion.trim() || isTyping}
              size="sm"
              className="px-3 bg-accent hover:bg-accent/90 h-8"
            >
              <Send className="w-3 h-3" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
