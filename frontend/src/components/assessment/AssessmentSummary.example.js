// Example usage of AssessmentSummary component
import AssessmentSummary from "./components/assessment/AssessmentSummary";

// Sample data structure that your backend should return
const sampleAssessmentData = {
  summary_report:
    "The cognitive assessment indicates overall good performance with some areas requiring attention. Memory and visual processing show strong results, while attention tasks suggest room for improvement. Speech analysis reveals mild mood indicators that warrant follow-up.",
  scores: {
    memory_game: 9.5,
    visual_memory: 9.5,
    stroop_color: 3.5,
    stroop_word: 3.5,
    speech_analysis: "Mild depression indicators",
    attention_switching: 9.5,
    mood_assessment: 54.72,
  },
  recommendations: [
    "Consult a healthcare professional for comprehensive evaluation",
    "Consider in-depth speech analysis with a specialist",
    "Explore possible underlying causes for attention difficulties",
    "Discuss potential interventions with your doctor",
    "Schedule follow-up assessment in 3-6 months",
  ],
  risk_category: "Mild",
  reportId: "assessment_123456789", // Used for PDF download
};

// Usage in your page/component
export default function AssessmentResultsPage() {
  return (
    <div>
      <AssessmentSummary data={sampleAssessmentData} />
    </div>
  );
}

// Alternative: If you're fetching data from API
export function AssessmentResultsWithAPI({ assessmentId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        const response = await fetch(`/api/assessment/${assessmentId}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching assessment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [assessmentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <AssessmentSummary data={data} />;
}
