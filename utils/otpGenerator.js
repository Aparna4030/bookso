const generateOtp = ()=>{
  return Math.floor(Math.random()*1000000)
    
}

// console.log(generateOtp())

module.exports = generateOtp