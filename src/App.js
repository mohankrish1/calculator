import { useState, useEffect } from 'react';
import Axios from 'axios';
import './index.css';
import { math } from 'math.js';

function App() {
  const [previous,setPrevious]=useState([]);
  const [display, setDisplay] = useState('');

  //Function to return precedence of operators
  function prec(c) {
    if (c == '^') return 3;
    else if (c == '/' || c == '*') return 2;
    else if (c == '+' || c == '-') return 1;
    else return -1;
  }

  // The main function to convert infix expression
  //to postfix expression
  function infixToPostfix(s) {
    let st = []; //For stack operations, we are using JavaScript built in stack
    let result = '(';

    for (let i = 0; i < s.length; i++) {
      let c = s[i];

      // If the scanned character is
      // an operand, add it to output string.
      if (
        (c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        (c >= '0' && c <= '9') ||
        c=='.'
      ){
         // if(result[result.length-1]==')')
         //    result+='(';
        result += c;
      }
      // If the scanned character is an
      // ‘(‘, push it to the stack.
      else if (c == '(') {
         st.push('(');
      }
      // If the scanned character is an ‘)’,
      // pop and to output string from the stack
      // until an ‘(‘ is encountered.
      else if (c == ')') {
        while (st[st.length - 1] != '(') {
          result += st[st.length - 1];
          st.pop();
        }
        st.pop();
      }

      //If an operator is scanned
      else {
         result+=')';

        while (st.length != 0 && prec(s[i]) <= prec(st[st.length - 1])) {
         if(result[result.length-1]=='('){
            result.pop();
         }
          result += st[st.length - 1];
          st.pop();
        }
        result+='(';
        st.push(c);
      }
    }

    // Pop all the remaining elements from the stack
    let c=result[result.length-1];
    if (
      (c >= 'a' && c <= 'z') ||
      (c >= 'A' && c <= 'Z') ||
      (c >= '0' && c <= '9')
    )
    result+=')';
    else if(c=='(')
      result.slice(0,-1);

    while (st.length != 0) {
      result += st[st.length - 1];
      st.pop();
    }

    //console.log(result);
    return result;
  }

  // Method to evaluate value of a postfix expression
  function evaluatePostfix(exp) {
    //create a stack
    let stack = [];

    // Scan all characters one by one
    //console.log(exp);
    for (let i = 0; i < exp.length; i++) {
      let c = exp[i];
      let res='';

      // If the scanned character is an operand (number here),
      // push it to the stack.
      if (c=='(') {
         i++;
         while(exp[i]!=')'){
            res+=exp[i];
            i++;
         }
         //console.log(res);
         //if(res.length>0)
         stack.push(Number(res));
         res='';
      }
      
      // If the scanned character is an operator, pop two
      // elements from stack apply the operator
      else {
         //continue;
        let val1 = stack.pop();
        let val2 = stack.pop();

        switch (c) {
          case '+':
            stack.push(val2 + val1);
            break;

          case '-':
            stack.push(val2 - val1);
            break;

          case '/':
            stack.push(val2 / val1);
            break;

          case '*':
            stack.push(val2 * val1);
            break;

         case '^':
            stack.push(val2 ** val1);
            break;

        }
      }
    }
    return stack.pop();
  }

  const calculate = () => {
    setPrevious(previous.concat(display));

    const value = evaluatePostfix(infixToPostfix(display));

    if(isNaN(value)){
      alert('Not valid ❌')
      setDisplay('');
    }else
    setDisplay(value.toString());
  };

  const handleClick = (value) => {
    value == 'C'
      ? setDisplay('')
      : value == 'DEL'
      ? setDisplay(prev => {
         //console.log(prev);
         return prev.substring(0,prev.length-1)
  })
      : value == '='
      ? calculate()
      : setDisplay((prev) => prev + value);
  };

  const handleEscape = () => {
   if(previous.length == 0){
      setDisplay('');
      return;
   }
   setDisplay(previous[previous.length-1]);
   setPrevious(previous.slice(0,-1));
  }

  return (
    <div>
      <h1 style={{color:"black"}}>Calculator</h1>
      <div className="calculator">
        <div>{display}</div>
        <div onClick={() => handleClick('7')}>7</div>
        <div onClick={() => handleClick('8')}>8</div>
        <div onClick={() => handleClick('9')}>9</div>
        <div onClick={() => handleClick('DEL')}>DEL</div>
        <div onClick={() => handleClick('C')}>AC</div>
        <div onClick={() => handleClick('4')}>4</div>
        <div onClick={() => handleClick('5')}>5</div>
        <div onClick={() => handleClick('6')}>6</div>
        <div onClick={() => handleClick('*')}>x</div>
        <div onClick={() => handleClick('/')}>/</div>
        <div onClick={() => handleClick('1')}>1</div>
        <div onClick={() => handleClick('2')}>2</div>
        <div onClick={() => handleClick('3')}>3</div>
        <div onClick={() => handleClick('+')}>+</div>
        <div onClick={() => handleClick('-')}>-</div>
        <div onClick={() => handleClick('0')}>0</div>
        <div onClick={() => handleClick('.')}>.</div>
        <div onClick={() => handleClick('^')}>^</div>
        <div onClick={handleEscape}>Esc</div>
        <div onClick={() => handleClick('=')}>=</div>
      </div>
    </div>
  );
}

export default App;
