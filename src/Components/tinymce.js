import { Editor } from "@tinymce/tinymce-react";

function Tinymce({ value, onChange }) {
  return (
    <Editor
      apiKey="qhetlv7ay1o9ek6daolopicpcba40z80rluexdyg9iuuryxf"
      value={value} // Use value from parent
      onEditorChange={onChange} // Update parent state
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
      }}
    />
  );
}

export default Tinymce;
