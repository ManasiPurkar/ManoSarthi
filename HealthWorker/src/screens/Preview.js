import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  Card,
} from "react-native";
import { CheckBox } from "react-native-elements";
import SelectService from "../Services/DatabaseServices/SelectService";
import PatientContext from "../context/PatientContext"; // Import PatientContext here
// import { useNavigation } from "@react-navigation/native";

const Preview = ({ navigation, route }) => {
  const { comment, commentID } = route.params; // Destructure comment and commentID from route.params
  const [consentChecked, setConsentChecked] = useState(false);
  const [medicalDetails, setMedicalDetails] = useState([]);
  const [medicalQuestions, setMedicalQuestions] = useState([]);
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [surveyQuestionsAnswers, setSurveyQuestionsAnswers] = useState([]);
  const [patientPersonalDetails, setPatientPersonalDeatils] = useState([]);
  const { age } = route.params;

  // const navigation = useNavigation();

  const handleCheckboxChange = () => {
    setConsentChecked(!consentChecked);
  };

  const showAlert = async () => {
    if (consentChecked) {
      try {
        // const res = await SelectService.getMedicalHistoryAnswers();
        Alert.alert("Data saved in local DB successfully!", "OK", [
          {
            text: "OK",
            onPress: () => {
              console.log("afdsa");
              console.log("Patient data has been successfully saved to the local database");
              navigation.navigate("HomeScreen");
            }
          },
        ]);
        // console.log("All data entries in table: ", res);
        // navigation.navigate("HomeScreen");
      } catch (error) {
        Alert.alert("Error!", "Failed to fetch data from local DB.", [
          { text: "OK" },
        ]);
        console.error(error);
      }
    } else {
      Alert.alert(
        "Please provide consent!",
        "You need to provide consent before submitting.",
        [{ text: "OK" }]
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const { aabhaId } = useContext(PatientContext);

  const fieldNames = {
    aabhaId: "Aabha ID",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    gender: "Gender",
    age: "Age",
    address: "Address",
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const medicalDetailsRes = await SelectService.getMedicalHistoryAnswers(
          aabhaId
        );
        setMedicalDetails(medicalDetailsRes);

        const medicalQuestionsRes =
          await SelectService.getAllMedicalQuestions();
        setMedicalQuestions(medicalQuestionsRes);

        const surveyQuestionsRes = await SelectService.getAllQuestions(
          age,
          "normal"
        );
        // console.log("quesiton surveyQuestionsRes",surveyQuestionsRes);
        setSurveyQuestions(surveyQuestionsRes);
        // console.log("quesiton surveyQuestions",surveyQuestions);
        const surveyQuestionsAnswers =
          await SelectService.getAllSurveyQuestionAnswersByAabhaId(aabhaId);
        setSurveyQuestionsAnswers(surveyQuestionsAnswers);

        const patient_details = await SelectService.getPatientDetailsByID(
          aabhaId
        );
        setPatientPersonalDeatils(patient_details);
        // console.log("Patient details array: ",patientPersonalDetails);
      } catch (error) {
        console.error("Error fetching data for preview:", error);
      }
    }
    fetchData();
  }, [aabhaId]);
  useEffect(() => {
    const fun = async () => {
      const data = await SelectService.getMedicalHistoryAnswers();
      console.log("[PreviewScreen]Medical QNA Fetched From Database", data);
    };
    fun();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.header}>Preview and Submit</Text>
        <View style={styles.detailsContainer}>
          {/* Patient Details */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Patient Details:</Text>
            {patientPersonalDetails.map((detail, index) => (
              <View key={index}>
                {Object.keys(detail).map((key) => (
                  <Text key={key}>
                    {fieldNames[key]}:{" "}
                    {key === "dob" ? formatDate(detail[key]) : detail[key]}
                  </Text>
                ))}
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Survey Questionnaire:</Text>
            {surveyQuestionsAnswers.map((detail, index) => (
              <Text key={index}>
                {surveyQuestions[index]?.question} - {detail.answer}
              </Text>
            ))}
          </View>

          {/* Medical Details */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Medical Details:</Text>
            {medicalQuestions.map((question, index) => {
              // Find the corresponding detail in medicalDetails based on question_id
              const detail = medicalDetails.find(
                (detail) => detail.question_id === question.question_id
              );
              // If detail exists, display the question and answer
              if (detail && question.question_id !== commentID) {
                return (
                  <Text key={index}>
                    {question.question}- {detail.question_ans}
                  </Text>
                );
              } else {
                return null; // If detail doesn't exist, return null
              }
            })}
            <Text>Comment: {comment}</Text>
          </View>
        </View>

        <View style={styles.checkboxContainer}>
          <CheckBox
            checked={consentChecked}
            onPress={handleCheckboxChange}
            checkedColor="blue"
            containerStyle={styles.checkbox}
          />
          <Text style={styles.consentText}>Consent of patient</Text>
        </View>

        <TouchableOpacity onPress={showAlert} style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2, // for Android
    shadowColor: "#000", // for iOS
    shadowOpacity: 0.1, // for iOS
    shadowRadius: 2, // for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    // paddingLeft: "8%",
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  detailsContainer: {
    marginBottom: 20,
  },
  button: {
    width: "40%",
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#3498db",
    borderRadius: 5,
    alignSelf: "center",
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  checkbox: {
    margin: 0,
    padding: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  consentText: {
    fontSize: 16,
    marginLeft: 8,
  },
});

export default Preview;
