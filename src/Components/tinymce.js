import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import  "../Css/Loader.css"
// Example Loader (basic CSS spinner)
const Loader = () => (
  <div style={{ textAlign: "center", padding: "20px" }}>
    <div className="loader"></div>
    <p>Loading editor...</p>
  </div>
);

function Tinymce({ value, onChange }) {
  const [loading, setLoading] = useState(true); // loading state

  return (
    <>
      {loading && <Loader />} {/* Show loader while loading */}

      <Editor
        apiKey="qhetlv7ay1o9ek6daolopicpcba40z80rluexdyg9iuuryxf"
        value={value}
        onEditorChange={onChange}
        init={{
          plugins: [
            "anchor",
            "autolink",
            "charmap",
            "codesample",
            "emoticons",
            "image",
            "link",
            "lists",
            "media",
            "searchreplace",
            "table",
            "visualblocks",
            "wordcount",
            "checklist",
            "mediaembed",
            "casechange",
            "export",
            "formatpainter",
            "pageembed",
            "a11ychecker",
            "tinymcespellchecker",
            "permanentpen",
            "powerpaste",
            "advtable",
            "advcode",
            "editimage",
            "advtemplate",
            "mentions",
            "tableofcontents",
            "footnotes",
            "mergetags",
            "autocorrect",
            "typography",
            "inlinecss",
            "markdown",
            "importword",
            "exportword",
            "exportpdf",
          ],
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | " +
            "link image media table mergetags | addcomment showcomments | " +
            "spellcheckdialog a11ycheck typography | align lineheight | " +
            "checklist numlist bullist indent outdent | emoticons charmap | removeformat",
          setup: (editor) => {
            editor.on("init", () => {
              setLoading(false); // editor is ready, hide loader
            });
          },
        }}
      />
    </>
  );
}

export default Tinymce;
