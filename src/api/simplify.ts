const simplifyText = async (text: string, token: string) => {
  try {
    const res = await fetch('http://localhost:5000/api/simplify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // Include Supabase JWT token if required
      },
      body: JSON.stringify({ text })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to simplify text');
    }

    return data.simplified;
  } catch (error) {
    console.error('API call failed:', error);
    return null;
  }
};

export default simplifyText;
