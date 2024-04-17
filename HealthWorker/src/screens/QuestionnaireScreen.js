import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import "../Services/SurveyQuestionsService";
import SelectService from "../Services/DatabaseServices/SelectService";
import PatientContext from "../context/PatientContext"; // Import PatientContext here
import InsertService from "../Services/DatabaseServices/InsertService";
import DeleteService from "../Services/DatabaseServices/DeleteService";

const QuestionnaireScreen = ({ navigation,route }) => {
  const [surveyquestions, setsurveyquestions] = useState([]);
  const {age} = route.params;
  // State to hold the answers for each question
  const [answers, setAnswers] = useState(
    []
  );
  const { aabhaId } = useContext(PatientContext); // Access aabhaId from the context

  // Sample questions
  // const questions = [
  //   "Are you feeling well today?",
  //   "Did you sleep well last night?",
  //   "Have you experienced any pain in the last 24 hours?",
  //   "Did you consume alcohol in the last 24 hours?",
  //   "Have you taken any medication today?",
  //   "Did you exercise today?",
  //   "Have you been following a healthy diet?",
  //   "Did you experience any stress today?",
  //   "Have you been smoking recently?",
  //   "Did you drink enough water today?",
  // ];
  const fetchPatientDataFromDatabase = async () => {
    // const navigation = useNavigation();
    console.log("Inside fetchPatientDataFromDatabase");
    try {
      console.log("In");
  
      const patient_data = await SelectService.getAllPatients();
      console.log("Homescreen Patients: ", patient_data);
    } catch (error) {
      console.error("Error fetching data from database(HomeScreen):", error);
    }
  };

  const fetchSurveyQuestionsFromDatabase = async () => {
    try {
      const data = await SelectService.getAllQuestions(age,"normal");
      setsurveyquestions(data);
      setAnswers(Array(data.length).fill(null));
      console.log("Survey Questions Need To Render: ", data);
    } catch (error) {
      console.error("Error fetching data from database:", error);
    }
  };

  const fetchSurveyQuestionsAnswersFromDatabase = async () => {
    try {
      const data = await SelectService.getAllSurveyQuestionAnswers();

      console.log("Response of Survey Questions Answers : ", data);
    } catch (error) {
      console.error("Error fetching data from database:", error);
    }
  };

  useEffect(() => {
    fetchPatientDataFromDatabase();
    fetchSurveyQuestionsFromDatabase();
    fetchSurveyQuestionsAnswersFromDatabase();
    // DeleteService.deleteAllSurveyQuestions();
  }, []);

  // Function to handle radio button selection
  const handleAnswerSelect = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // Function to handle navigation to next screen
  const handleNext = async () => {
    // Perform any necessary validation before proceeding
    // For example, you can check if all questions are answered
    if (answers.some((answer) => answer === null)) {
      Alert.alert("Please answer all questions.");
      return;
    }

    console.log("Answers: ", answers);
    try {
      const promises = surveyquestions.map(async (question, index) => {
        const answer = answers[index];
        await InsertService.insertSurveyQuestionAnswer(
          aabhaId,
          question.question_id,
          answer
        );
      });
      await Promise.all(promises).then((msg)=>{console.log("msg success",msg)}).catch((err)=>{console.log("err catch",err)});
      
      // Matching the answers with the default ans
      const unmatchedCount = countUnmatchedAnswers(surveyquestions, answers);
      console.log("Unmatched count:", unmatchedCount);

      // Navigate to the next screen
      if (unmatchedCount >= 3) {
        await InsertService.insertAabhaId(aabhaId, "old");
        navigation.navigate("MedicalDetails");
      } else {
        const res1 = await InsertService.insertAabhaId(aabhaId, "new");
        connsole.log("Res1- Not Reffered Patient AabhaId ",res1)
        const res2 = await DeleteService.deleteSurveyQuestionAnswersByAabhaId(
          aabhaId
        );
        connsole.log("Res2- Not Reffered Patient SurveyQNA ",res2)

        const res3 = await DeleteService.deletePatientByAabhaId(aabhaId);
        connsole.log("Res3- Not Reffered Patient Details ",res3)

        // const deldata = await SelectService.getAllSurveyQuestionAnswers();
        // console.log("QAdata after deletion from DB: ", deldata);
        // const delpdata = await SelectService.getAllPatients();
        // console.log("Pdata after deletion from DB: ", delpdata);
        Alert.alert(
          "Not referring to the doctor",
          "Related data is deleted from DB"
        );
        navigation.navigate("HomeScreen");
      }
    } catch (error) {
      console.error("Error inserting survey answers:", error);
    }
  };

  const countUnmatchedAnswers = (questions, answers) => {
    let unmatchedCount = 0;
    questions.forEach((question, index) => {
      if (answers[index] !== question.default_ans) {
        unmatchedCount++;
      }
    });
    return unmatchedCount;
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {surveyquestions.map((item, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.questionText}>{item.question}</Text>
            <View style={styles.radioButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  answers[index] === "yes" && styles.radioButtonSelected,
                ]}
                onPress={() => handleAnswerSelect(index, "yes")}
              >
                <Text style={styles.radioButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  answers[index] === "no" && styles.radioButtonSelected,
                ]}
                onPress={() => handleAnswerSelect(index, "no")}
              >
                <Text style={styles.radioButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  radioButtonContainer: {
    flexDirection: "row",
  },
  radioButton: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: "#3498db",
  },
  radioButtonText: {
    fontSize: 16,
    color: "#000",
  },
  nextButton: {
    backgroundColor: "#3498db",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default QuestionnaireScreen;