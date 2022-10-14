import React, { Component } from 'react';
import axios from 'axios';

const ProcessingIcon = (className = '') => (
 <svg className={`animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
 </svg>
);

const WaitingIcon = (className = '') => (
 <svg className={`animate-pulse -ml-1 mr-3 h-5 w-5 text-yellow-500 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  <path fill="currentColor" d="M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm0-18a8 8 0 100 16 8 8 0 000-16z"></path>
  <path fill="currentColor" d="M12 6v10l6-5-6-5z"></path>
 </svg>
);

const DoneIcon = (className = '') => (
 <svg className={`-ml-1 mr-3 h-5 w-5 text-green-500 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  <path fill="currentColor" d="M5 13l4 4L19 7l-2-2-9 9-3-3-2 2z"></path>
 </svg>
);

const ErrorIcon = (className = '') => (
 <svg className={`-ml-1 mr-3 h-5 w-5 text-red-500 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  <path fill="currentColor" d="M6 18L18 6M6 6l12 12"></path>
 </svg>
);

class Main extends Component {
 state = {
  seenIndexes: [],
  values: {},
  index: ''
 };

 componentDidMount() {
  setInterval(() => {
   axios.get('/api/values/current').then(({ data }) => {
    this.setState({ values: data });
   });
  }, 1500);

  setInterval(() => {
   axios.get('/api/values/all').then(({ data }) => {
    this.setState({ seenIndexes: data });
   });
  }, 10_000)
 }

 handleSubmit = async (event) => {
  event.preventDefault();
  await axios.post('/api/values', {
   index: this.state.index
  });
  this.setState({ index: '' });
 }

 render() {
  const values = Object.entries(this.state.values);
  return (
   <div className='flex'>

    {/* left part of app */}
    <div className={"flex flex-col items-center justify-center w-4/12 h-full bg-green-400"}>
     <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 m-6 w-96">
       <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-sans font-semibold text-center">
         Heavy Computation Frontend  <br />
        </h1>
        <p className="pt-2 text-gray-600 text-center">
         Takes a long time to compute value for given number and display it here
        </p>

        <div className="p-4">

         <div className="relative flex flex-col w-full max-w-xs mx-auto">
          <div className="relative">
           <input type="number" id="index" name="index" placeholder="Enter your number"
            className="block w-full px-4 py-3 pr-10 text-gray-700 placeholder-gray-500 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
            value={this.state.index}
            onChange={event => this.setState({ index: event.target.value })}
           />
           <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
             <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 2a10 10 0 100-20 10 10 0 000 20z" clipRule="evenodd" />
            </svg>
           </div>
          </div>
         </div>


         <div className="w-full flex flex-col justify-center p-2">
          {/* tailwind button */}
          <button className="cursor-pointer mt-2 text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full"
           onClick={this.handleSubmit}>
           Push to Computation
          </button>
         </div>
        </div>
       </div>
      </div>
     </div>
    </div>

    {/* right part of app */}
    <div className={"flex flex-col items-center justify-center w-8/12 h-full bg-blue-50"}>
     <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 m-6 w-full ">

       {values.length > 0 ?
        <div>
         <div className="flex flex-col items-center justify-center">

          <h1 className="text-2xl font-sans font-semibold text-center">
           Results of Computation
          </h1>
          <p className="pt-2 text-gray-600 text-center">
           Realtime Data that is being processed by worker
          </p>

          <ul className="list-disc list-inside pt-4">
           {values.map(([index, value]) => (<>
            <li key={index} className="flex flex-row items-center ">
             {
              (value).includes('Processing')
               ? <ProcessingIcon />
               : (value).includes('Waiting')
                ? WaitingIcon()
                : (value).includes('Error')
                 ? ErrorIcon()
                 : DoneIcon()
             }
             {/* single line */}
             <p className='text-gray-600 max-w-md'>
              <span className="font-bold text-2xl">{index}</span>
              <span className="font-bold text-2xl px-2"> ➙ </span>
              <span className='text-2xl px-2' >{value}</span>
             </p>
            </li>
            {/* divider */}
            <hr className="w-full py-4 px-2" />
           </>))}
          </ul>
         </div >
        </div > : <div className="flex flex-col items-center justify-center">
         <h1 className="text-2xl font-sans font-semibold text-center">
          No results yet!
         </h1>
         <p className="pt-2 text-gray-600 text-center">
          Enter a number and click on "Push to Computation" button
          to start seeing results here
         </p>
        </div>}
      </div >
     </div >
    </div >
   </div >
  );
 }

}

export default Main;