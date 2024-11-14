document.getElementById('upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const fileInput = document.getElementById('file-input');
  const preview = document.getElementById('preview');
  const resultDiv = document.getElementById('classification-result');
  
  const file = fileInput.files[0];
  if (!file) {
      alert('이미지를 선택해주세요');
      return;
  }

  // 이미지 미리보기
  preview.src = URL.createObjectURL(file);
  preview.style.display = 'block';
  
  // FormData 객체 생성
  const formData = new FormData();
  formData.append('file', file);

  try {
      resultDiv.textContent = '분류 중...';
      
      // 서버로 이미지 전송
      console.log('Sending file:', file.name, file.type);

      const response = await fetch('http://localhost:5000/classify', {
          method: 'POST',
          body: formData
      });

      if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`서버 오류가 발생했습니다: ${errorData.detail}`);
      }

      const result = await response.json();
      console.log('서버 응답:', result);
      console.log('설정할 텍스트:', `결과: ${result.pred_label}, ${result.pred_class}, ${result.pred_conf}`);
      resultDiv.style.whiteSpace = 'pre-line';
      resultDiv.textContent = `결과\n예측 레이블: ${result.pred_label}\n예측 클래스: ${result.pred_class}\n예측 신뢰도: ${result.pred_conf}%`;
      console.log('설정된 텍스트:', resultDiv.textContent);
  } catch (error) {
      resultDiv.textContent = `오류: ${error.message}`;
      console.error('Error:', error);
  }
});