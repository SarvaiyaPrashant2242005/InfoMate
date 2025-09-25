# Subject PDFs

Place your subject PDFs in the following structure so downloads work from the UI:

- diploma/
  - sem1/
  - sem2/
  - sem3/
  - sem4/
  - sem5/
  - sem6/
- degree/
  - sem1/
  - sem2/
  - sem3/
  - sem4/
  - sem5/
  - sem6/
  - sem7/
  - sem8/

Example paths used in code:
- /pdfs/diploma/sem1/applied_mathematics_1.pdf
- /pdfs/degree/sem6/machine_learning.pdf

Create the directories above and drop the files with matching names, or update `client/src/data/staticCourses.js` to match your actual filenames.
