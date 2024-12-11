import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  const [input, setInput] = useState(''); // Current expression
  const [result, setResult] = useState(''); // Calculated result

  const isOperator = (char) => ['+', '-', '*', '/'].includes(char);

  const handleButtonPress = (value) => {
    // Prevent operators at the start
    if (isOperator(value) && input === '') {
      return;
    }
  
    // Prevent consecutive operators
    if (isOperator(value) && isOperator(input.slice(-1))) {
      setInput((prev) => prev.slice(0, -1) + value); // Replace the last operator
      return;
    }
  
    // Prevent multiple decimals in the same number
    if (value === '.') {
      const lastNumber = input.split(/[\+\-\*\/]/).pop();
      if (lastNumber.includes('.')) {
        return; // Ignore if the current number already has a decimal
      }
    }
  
    // Prevent multiple consecutive '%' signs
    if (value === '%' && input.slice(-1) === '%') {
      return; // Ignore if the last character is already '%'
    }
  
    // Append valid input
    setInput((prev) => prev + value);
  };
  
  const handleClearPress = () => {
    setInput('');
    setResult('');
  };

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1)); // Remove the last character
  };

  const handleEqualPress = () => {

    if (/\/0(?![.\d])/g.test(input)) {
      setResult('Error');
      return;
    }
    try {
      // Remove leading zeros from numbers 
      const sanitizedInput = input.replace(/(\d+)(?=\d)/g, (match) => match.replace(/^0+/, ''));
      
      // Replace percentage symbols with `/100`
      const finalInput = sanitizedInput.replace(/(\d+)%/g, "($1/100)");
      
      const evaluatedResult = eval(finalInput).toString(); // Safely evaluate the input
      setResult(evaluatedResult);
    } catch {
      setResult('Error');
    }
  };
  
  

  const handlePiPress = () => {
    // Allow π only at valid positions
    if (input === '' || isOperator(input.slice(-1))) {
      setInput((prev) => prev + Math.PI.toFixed(5)); // Append π value
    }
  };

  const renderButton = (label, onPressHandler, style = {}) => (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPressHandler}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
  

  return (
    <View style={styles.container}>
      {/* Display Input */}
      <Text
        style={styles.input}
        numberOfLines={1}
        adjustsFontSizeToFit
        ellipsizeMode="tail"
      >
        {input || '0'}
      </Text>

      {/* Display Result */}
      {result !== '' && (
        <Text
          style={styles.result}
          numberOfLines={1}
          adjustsFontSizeToFit
          ellipsizeMode="tail"
        >
          = {result}
        </Text>
      )}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
  {renderButton('C', handleClearPress, styles.operatorButton)}
  {renderButton('⌫', handleBackspace, styles.operatorButton)}
  {renderButton('%', () => handleButtonPress('%'), styles.operatorButton)}
  {renderButton('/', () => handleButtonPress('/'), styles.operatorButton)}

  {renderButton('7', () => handleButtonPress('7'))}
  {renderButton('8', () => handleButtonPress('8'))}
  {renderButton('9', () => handleButtonPress('9'))}
  {renderButton('*', () => handleButtonPress('*'), styles.operatorButton)}

  {renderButton('4', () => handleButtonPress('4'))}
  {renderButton('5', () => handleButtonPress('5'))}
  {renderButton('6', () => handleButtonPress('6'))}
  {renderButton('-', () => handleButtonPress('-'), styles.operatorButton)}

  {renderButton('1', () => handleButtonPress('1'))}
  {renderButton('2', () => handleButtonPress('2'))}
  {renderButton('3', () => handleButtonPress('3'))}
  {renderButton('+', () => handleButtonPress('+'), styles.operatorButton)}

  {/* New row for 0, ., =, π */}
  <View style={styles.lastRow}>
    {renderButton('0', () => handleButtonPress('0'))}
    {renderButton('.', () => handleButtonPress('.'))}
    {renderButton('π', handlePiPress)}
    {renderButton('=', handleEqualPress, styles.equalsButton)}
  </View>
</View>


    </View>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Dark modern background
    padding: 10,
  },
  input: {
    fontSize: 36,
    color: '#000000',
    alignSelf: 'flex-end',
    marginRight: 10,
    maxWidth: '95%',
    marginBottom: 10,
  },
  result: {
    fontSize: 28,
    color: '#9e9e9e',
    alignSelf: 'flex-end',
    marginRight: 10,
    marginBottom: 20,
    maxWidth: '95%',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  lastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    width: '22%', // Standard size for buttons
    height: 70,   // Keep all buttons the same height
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c2c2e',
    margin: 5,
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '500',
  },
  operatorButton: {
    backgroundColor: '#ff9500', // Highlight operators
  },
  equalsButton: {
    backgroundColor: '#34c759', // Green for "equals"
  },
});

