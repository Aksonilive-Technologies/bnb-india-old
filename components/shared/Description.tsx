import React, { useCallback, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  [ 'link', 'blockquote', 'code-block'],
  ['clean'],
];

const FORMATS = [
  'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline',
  'color', 'background', 'script', 'align', 'image', 'link', 'blockquote', 'code-block'
];

const RichTextEditor: React.FC<{ value: string; onChange: (value: string) => void; }> = ({ value, onChange }) => {
  const quillRef = useRef<ReactQuill | null>(null);
  const [text, setText] = useState(value);

  // const handleImageUpload = useCallback(async (file: File) => {
  //   return new Promise<string>((resolve, reject) => {
  //     if (!file) {
  //       reject('No file provided');
  //       return;
  //     }

  //     const storageRef = ref(storage, `images/${file.name}`);
  //     const uploadTask = uploadBytesResumable(storageRef, file);

  //     uploadTask.on(
  //       'state_changed',
  //       (snapshot) => {
  //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         console.log(`Upload is ${progress}% done`);
  //       },
  //       (error) => {
  //         console.error('Image upload failed:', error);
  //         reject('Upload failed');
  //       },
  //       async () => {
  //         try {
  //           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  //           resolve(downloadURL);
  //         } catch (error) {
  //           console.error('Error getting download URL:', error);
  //           reject('Error getting download URL');
  //         }
  //       }
  //     );
  //   });
  // }, []);

  // const handleImageInsert = useCallback((url: string) => {
  //   const quill = quillRef.current?.getEditor();
  //   if (quill) {
  //     const range = quill.getSelection();
  //     if (range) {
  //       quill.insertEmbed(range.index, 'image', url);
  //     } else {
  //       console.warn('No selection range found.');
  //     }
  //   } else {
  //     console.warn('Quill editor not available.');
  //   }
  // }, []);

  return (
    <div className="my-4 w-full min-h-[40vh] rounded-sm">
      <div className="p-1 border border-gray-300 rounded-sm">
        <ReactQuill
          ref={quillRef}
          value={text}
          onChange={(current) => {
            setText(current);
            onChange(current);
            console.log(current);
          }}
          modules={{
            toolbar: {
              container: TOOLBAR_OPTIONS,
              handlers: {
                // image: () => {
                //   const input = document.createElement('input');
                //   input.setAttribute('type', 'file');
                //   input.setAttribute('accept', 'image/*');
                //   input.click();
                //   input.onchange = async () => {
                //     const file = input.files ? input.files[0] : null;
                //     if (file) {
                //       try {
                //         const url = await handleImageUpload(file);
                //         handleImageInsert(url);
                //       } catch (error) {
                //         console.error('Error uploading image:', error);
                //       }
                //     }
                //   };
                // },
              },
            },
          }}
          formats={FORMATS}
          className="h-full text-gray-800"
          style={{ height: '100%', borderRadius: '8px' }}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
