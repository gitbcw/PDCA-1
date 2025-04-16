export * from "./date"

// 邮箱验证正则表达式
export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// 处理API错误
export const handleError = (error: any) => {
  console.error("API Error:", error)
  let errorMessage = "发生未知错误"
  
  if (error.body && error.body.detail) {
    errorMessage = error.body.detail
  } else if (error.message) {
    errorMessage = error.message
  }
  
  return errorMessage
}
