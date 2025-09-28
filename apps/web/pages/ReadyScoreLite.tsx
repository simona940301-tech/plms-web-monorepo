
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../components/ui/Button';
import { track } from '../lib/track';
import { WrongCause } from '../types/domain';
import useWaitlistStore from '../state/useWaitlistStore';
import useUiStore from '../state/useUiStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import ChartWrapper from '../components/ChartWrapper';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { submitRSLiteAttempt } from '../lib/api';

const questions = [
  { question: "Which of the following is a synonym for 'ubiquitous'?", options: ["rare", "common", "hidden", "complex"], answer: 1 },
  { question: "Complete the sentence: 'She is interested ___ learning French.'", options: ["on", "at", "in", "with"], answer: 2 },
  { question: "Identify the correct sentence.", options: ["He go to school.", "She have a cat.", "They are playing.", "I is happy."], answer: 2 },
  { question: "What is the past tense of 'begin'?", options: ["begun", "began", "beginned", "begind"], answer: 1 },
  { question: "Choose the correct pronoun: 'Give the book to ___.'", options: ["I", "me", "myself", "my"], answer: 1 },
  { question: "Which word is an adjective?", options: ["quickly", "run", "beautiful", "house"], answer: 2 },
  { question: "Select the correctly spelled word.", options: ["neccessary", "necesary", "necessary", "neccesary"], answer: 2 },
  { question: "What does the idiom 'bite the bullet' mean?", options: ["eat something hard", "go to the dentist", "endure a difficult situation", "get shot"], answer: 2 },
  { question: "Which sentence uses 'their', 'there', and 'they're' correctly?", options: ["They're over their, with there dog.", "Their over there, with they're dog.", "They're over there, with their dog.", "There over they're, with their dog."], answer: 2 },
  { question: "What is the main idea of a passage about a boy who finds a lost dog and returns it to its owner?", options: ["Dogs are good pets.", "It's important to be honest.", "Walking in the park is fun.", "You can earn money by finding dogs."], answer: 1 }
];

const wrongCauseOptions: { id: WrongCause, label: string }[] = [
    { id: 'careless', label: '粗心' },
    { id: 'vocab', label: '詞彙/文法' },
    { id: 'inference', label: '閱讀推論' },
    { id: 'time', label: '時間壓力' },
];

const ReadyScoreLite: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(10).fill(null));
  const [startTime, setStartTime] = useState(0);
  const [usedBack, setUsedBack] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongCauses, setWrongCauses] = useState<WrongCause[]>([]);
  const hasJoinedWaitlist = useWaitlistStore(state => state.hasJoined);
  const openWaitlistModal = useUiStore(state => state.openWaitlistModal);
  
  // Mock data for full report
  const fullReportData = {
    gapSeries: [
        { t: 'Week -4', pct: score * 10 - 15 },
        { t: 'Week -3', pct: score * 10 - 10 },
        { t: 'Week -2', pct: score * 10 - 5 },
        { t: 'Week -1', pct: score * 10 - 2 },
        { t: 'Now', pct: score * 10 },
    ],
    wrongCauseStats: wrongCauses.reduce((acc, cause) => ({...acc, [cause]: (acc[cause] || 0) + 1 }), {} as Record<WrongCause, number>)
  };


  useEffect(() => {
    track('rslite_start');
    setStartTime(Date.now());
  }, []);

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setUsedBack(true);
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishQuiz = async () => {
    const durationSec = Math.round((Date.now() - startTime) / 1000);
    let finalScore = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].answer) {
        finalScore++;
      }
    });
    setScore(finalScore);
    setFinished(true);

    const payload = {
      score: finalScore,
      pct: finalScore * 10,
      durationSec,
      used_back: usedBack,
      wrongCauses: [], // will be updated after user selects them
    };
    track('rslite_finish', payload);
    // await submitRSLiteAttempt(payload); // Submit after collecting wrong causes
  };
  
   const handleWrongCauseToggle = (cause: WrongCause) => {
    setWrongCauses(prev => 
        prev.includes(cause) ? prev.filter(c => c !== cause) : [...prev, cause]
    );
  };

  const submitFinalReport = async () => {
     const durationSec = Math.round((Date.now() - startTime) / 1000);
     const payload = {
      score: score,
      pct: score * 10,
      durationSec,
      used_back: usedBack,
      wrongCauses: wrongCauses,
    };
    await submitRSLiteAttempt(payload);
    track('rslite_submit_causes', { causes: wrongCauses });

    if (!hasJoinedWaitlist) {
      openWaitlistModal();
    }
  }


  if (finished) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">Your Ready Score Lite Result</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-7xl font-bold text-primary">{score * 10}%</p>
            <p className="mt-2 text-muted-foreground">You answered {score} out of 10 questions correctly.</p>

            <div className="mt-8 text-left">
              <h3 className="font-semibold text-lg">分析錯誤原因 (可複選)</h3>
              <p className="text-sm text-muted-foreground">協助我們更精準分析你的弱點</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {wrongCauseOptions.map(cause => (
                    <button key={cause.id} onClick={() => handleWrongCauseToggle(cause.id)} 
                    className={`px-4 py-2 rounded-full border text-sm transition-colors ${wrongCauses.includes(cause.id) ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent hover:bg-accent'}`}>
                        {cause.label}
                    </button>
                ))}
              </div>
            </div>

            <Button onClick={submitFinalReport} className="mt-8">
                查看完整分析 & 解鎖學習計畫
            </Button>

            {hasJoinedWaitlist && (
                 <div className="mt-12 text-left space-y-8">
                    <div>
                        <h3 className="font-bold text-2xl">與頂尖考生的差距</h3>
                        <ChartWrapper>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={fullReportData.gapSeries}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="t" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="pct" name="Your Score" stroke="#2563EB" strokeWidth={2} />
                                    <Line type="monotone" dataKey={() => 85} name="Top 1%" stroke="#4ADE80" strokeDasharray="5 5" />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartWrapper>
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl">錯誤原因統計</h3>
                         <ChartWrapper>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={Object.entries(fullReportData.wrongCauseStats).map(([name, value]) => ({ name, value }))}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" name="次數" fill="#2563EB" />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartWrapper>
                    </div>

                    <div className="text-center pt-8">
                        <h3 className="font-bold text-2xl">🚀 加入官方 LINE，領取完整學習計畫！</h3>
                        <p className="mt-2 text-muted-foreground">與你的專屬台大家教聯繫，開始高效衝刺！</p>
                        <Button className="mt-4" size="lg">加入官方 LINE</Button>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = (currentQuestion / questions.length) * 100;
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="w-full bg-muted rounded-full h-2.5 mb-4">
        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Question {currentQuestion + 1}/10</CardTitle>
          <CardDescription>{questions[currentQuestion].question}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                className={`w-full text-left p-4 border rounded-lg transition-colors ${
                  answers[currentQuestion] === index
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-accent'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-between">
        <Button onClick={handleBack} disabled={currentQuestion === 0} variant="outline">
          Back
        </Button>
        <Button onClick={handleNext} disabled={answers[currentQuestion] === null}>
          {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default ReadyScoreLite;

