// This function takes a string, cleans it, send it to the api, and returns a simplified version of it.

export async function sendToAI(original: string): Promise<string> {
    if (!original.trim()) {
      return "Please enter some text to simplify.";
    }
  
    try {
      // Example of a fake "simplification"
      const simplified = original
        .split('.')
        .map(sentence => sentence.trim())
        .filter(Boolean)
        .map(sentence => `• ${sentence}`)
        .join('\n');
  
      return simplified;
    } catch (error) {
      console.error("Simplification error:", error);
      return "An error occurred while simplifying the text.";
    }
  }