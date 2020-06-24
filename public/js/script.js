function showOrHideInfo(item)
{
    const session = item.getAttribute('data');
    const element = document.getElementById(session);

    element.classList.toggle('detail-hide');

    item.innerHTML = item.innerHTML == 'Esconder' ? 'Mostrar' : 'Esconder';

}

const showOrHideAll = document.querySelectorAll('span.toggle-item');

if (showOrHideAll)
{
    showOrHideAll.forEach(showOrHide =>
    {
        showOrHide.addEventListener('click', (event) => showOrHideInfo(event.target));
    });
}

function addNewIngridentOrStep(item)
{
    const dataAttribute = item.getAttribute('data');
    const element = document.querySelector(`#${dataAttribute}s`);

    const fieldContainer = document.querySelector(`.${dataAttribute}`);

    const newField = fieldContainer.cloneNode(true);

    if (newField.children[0].value == '') return false;

    newField.children[0].value = '';
    element.appendChild(newField);
}

const addButtons = document.querySelectorAll('.field-item > button');

addButtons.forEach(button => 
{
    button.addEventListener('click', (event) =>
    {
        event.preventDefault();
        addNewIngridentOrStep(event.target);
    });
});

const PhotosUpload =
{
    input: '',
    preview: document.querySelector('#photos-preview'),
    files: [],
    uploadLimit: () => 5,
    totalUploaded: 0,

    handleFileInput(event)
    {
      const { files: fileList } = event.target;
      PhotosUpload.input = event.target;

      if (PhotosUpload.hasLimit(event))
          return;

      Array.from(fileList).forEach(file =>
      {
          PhotosUpload.files.push(file);

          const fileReader = new FileReader();

          fileReader.onload = () =>
          {
              const image = new Image();
              image.src = String(fileReader.result);
              const div = PhotosUpload.getContainer(image);
              PhotosUpload.preview.appendChild(div);

              PhotosUpload.totalUploaded++;
          };

          fileReader.readAsDataURL(file);
      });

      PhotosUpload.input.files = PhotosUpload.getAllFiles();
    },

    hasLimit(event)
    {
      let { uploadLimit, totalUploaded, input } = PhotosUpload;
      let { files: fileList } = input;

      if ((fileList.length + totalUploaded) > uploadLimit() + 1)
      {
          alert(`A quantidade máxima de imagens permitida é ${uploadLimit()}`);
          event.preventDefault();
          return true;
      }
      return false;
    },

    getContainer(image)
    {
        const div = document.createElement('div');
        div.classList.add('photo');

        div.onclick = PhotosUpload.removePhoto;

        div.appendChild(image);
        div.appendChild(PhotosUpload.getRemoveButton());

        return div;
    },

    removePhoto(event)
    {
        const photoDiv = event.target.parentNode;
        const photoArray = Array.from(PhotosUpload.preview.children);
        const index = photoArray.indexOf(photoDiv);

        PhotosUpload.files.splice(index, 1);
        PhotosUpload.input.files = PhotosUpload.getAllFiles();

        photoDiv.remove();

        PhotosUpload.totalUploaded -= PhotosUpload.totalUploaded > 1 ? 1 : 0;
    },

    getAllFiles()
    {
        const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer();

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file));

        return dataTransfer.files;
    },

    getRemoveButton()
    {
        const button = document.createElement('i');
        button.classList.add('material-icons');
        button.innerHTML = 'close';

        return button;
    },

    removeOldPhoto(event)
    {
        const photoDiv = event.target.parentNode;

        if (photoDiv.id)
        {
            const removedFiles = document.querySelector('input[name="removedImagens"]');
            if (removedFiles)
            {
                removedFiles.value += `${photoDiv.id},`;
            }
        }

        photoDiv.remove();

        PhotosUpload.totalUploaded -= PhotosUpload.totalUploaded > 1 ? 1 : 0;
    }
};