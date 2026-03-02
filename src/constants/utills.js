import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { pageLoaderHandler } from '../helpers';
import moment from 'moment';

export const validateFileSize = (file, maxSizeMB) => {
  // Convert MB to bytes (1MB = 1 * 1024 * 1024 bytes)
  const maxSizeInBytes = maxSizeMB * 1024 * 1024;

  // Check if the file size exceeds the max size

  if (file && file?.size > maxSizeInBytes) {
    return `File size exceeds ${maxSizeMB}MB. Please select a smaller file.`; // Return false if file is too large
  }

  return true; // Return true if file is valid
};

export const validateImageDimensions = (
  file,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight
) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectURL = URL.createObjectURL(file);

    img.onload = () => {
      // Check if image dimensions are within the specified range
      if (
        img.width >= minWidth &&
        img.width <= maxWidth &&
        img.height >= minHeight &&
        img.height <= maxHeight
      ) {
        resolve(true); // Valid dimensions
      } else {
        reject(
          `Image dimensions must be between ${minWidth}px and ${maxWidth}px for width, and ${minHeight}px and ${maxHeight}px for height.`
        );
      }
    };

    img.onerror = () => {
      reject('Error loading image.');
    };

    img.src = objectURL;
  });
};

export const formatValue = (value, point) => {
  // Check if the value has decimals
  if (value % 1 !== 0) {
    return value.toFixed(point ? point : 2); // If it's a decimal, round to 2 decimal places
  } else {
    return value; // If it's an integer, just display the value
  }
};

export const hasDuplicates = (arr, key) => {
  // Remove objects with empty 'value' fields before checking for duplicates
  const filteredArr = arr.filter((item) => item[key] !== '');

  // Get the values to check for duplicates
  const values = key
    ? filteredArr.map((item) => item[key].toUpperCase())
    : arr.map((item) => item.toUpperCase());

  // Return whether duplicates exist
  return new Set(values).size !== values.length;
};

// export const generatePDF = (id, width = 'auto', height = 'auto', name) => {
//   const content = document.getElementById(id);

//   // Ensure that content has been loaded fully before proceeding
//   if (!content) return;

//   // Capture the content using html2canvas
//   html2canvas(content, { scrollX: 0, scrollY: -window.scrollY }).then(
//     (canvas) => {
//       const imgData = canvas.toDataURL('image/png');

//       // Create a new jsPDF instance
//       const doc = new jsPDF();

//       // Get the width and height of the content (in pixels)
//       const contentWidth = content.offsetWidth;
//       const contentHeight = content.offsetHeight;

//       // Convert pixels to millimeters (for the PDF format)
//       const mmPerInch = 25.4;
//       const dpi = 96;
//       const widthInMm = (contentWidth / dpi) * mmPerInch;
//       const heightInMm = (contentHeight / dpi) * mmPerInch;

//       // If 'auto' is passed, use the calculated dimensions
//       const finalWidth = width === 'auto' ? widthInMm : width;
//       const finalHeight = height === 'auto' ? heightInMm : height;

//       // Add the image to the PDF
//       doc.addImage(imgData, 'PNG', 10, 10, finalWidth, finalHeight);

//       // Save the PDF with a dynamic name
//       doc.save(`${name || 'chart'}.pdf`);
//     }
//   );
// };

export const generatePDF = (
  id,
  width = 'auto',
  height = 'auto',
  name,
  setIsPdfloading
) => {
  const content = document.getElementById(id);

  // Ensure the content exists
  if (!content) return;

  // Store the original structure of the content
  const originalContent = content.innerHTML;
  // const contentClone = content.cloneNode(true);

  const chartContainer = content.querySelector('.chart-container');
  // pageLoaderHandler('show');
  if (chartContainer) {
    chartContainer.classList.remove('col-md-8');
    chartContainer.classList.add('col-md-12');
  }
  setIsPdfloading(true);
  html2canvas(content, { scrollX: 0, scrollY: -window.scrollY }).then(
    (canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF();

      // Get the width and height of the content (in pixels)
      const contentWidth = content.offsetWidth;
      const contentHeight = content.offsetHeight;

      // Convert pixels to millimeters (for the PDF format)
      const mmPerInch = 25.4;
      const dpi = 96;
      const widthInMm = (contentWidth / dpi) * mmPerInch;
      const heightInMm = (contentHeight / dpi) * mmPerInch;

      // If 'auto' is passed, use the calculated dimensions
      const finalWidth = width === 'auto' ? widthInMm : width;
      const finalHeight = height === 'auto' ? heightInMm : height;

      // Add the image to the PDF
      doc.addImage(imgData, 'PNG', 10, 10, finalWidth, finalHeight);
      doc.save(`${name || 'chart'}.pdf`);
      setIsPdfloading(false);
      content.innerHTML = originalContent;
    }
  );
};
export const checkDate = (inputDate) => {
  // Convert the input date (dd/mm/yyyy) to a Date object, ignoring the year
  const [day, month] = inputDate.split('/').map(Number);
  const inputDateObj = new Date(2025, month - 1, day); // Set year to a constant (e.g., 2025)

  // Get today's date and tomorrow's date, ignoring the year
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Set the year of both today's and tomorrow's date to a constant (e.g., 2025) to ignore year comparison
  today.setFullYear(2025);
  tomorrow.setFullYear(2025);

  // Set the time to midnight to ignore time comparison
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  inputDateObj.setHours(0, 0, 0, 0);

  // Compare the dates (only day and month)
  if (inputDateObj.getTime() === today.getTime()) {
    return 'Today';
  } else if (inputDateObj.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  } else {
    // Return the original date in "DD/MM" format
    return getDayMonthOnly(inputDate);
  }
};

export const getDayMonthOnly = (date) => {
  let fixedDate = date;

  // If input is in dd/mm or mm/dd format, add a dummy year
  if (/^\d{2}\/\d{2}$/.test(date)) {
    fixedDate = `${date}/2025`; // Append fake year to make it valid
  }

  const m = moment(fixedDate, ['DD/MM/YYYY', 'MM/DD/YYYY']);
  // Get global format or fallback
  const globalFormat =
    JSON.parse(
      sessionStorage.getItem('userData')
    )?.theme?.[0]?.dateFormat?.toLowerCase() || 'dd-mm-yyyy';

  // Extract order based on global format
  let format = '';

  if (globalFormat.startsWith('dd')) {
    // Use "DD MMMM" or "DD/MM"
    format = globalFormat.includes('mmmm')
      ? 'DD MMMM'
      : globalFormat.includes('.')
      ? 'DD.MM'
      : globalFormat.includes('/')
      ? 'DD/MM'
      : 'DD-MM';
  } else if (globalFormat.startsWith('mm')) {
    format = globalFormat.includes('mmmm')
      ? 'MMMM DD'
      : globalFormat.includes('.')
      ? 'MM.DD'
      : globalFormat.includes('/')
      ? 'MM/DD'
      : 'MM-DD';
  } else {
    format = 'DD-MM'; // fallback
  }

  return m.isValid() ? m.format(format) : date;
};
// Example usage

export const formatDates = (date, includeTime = false, formatType) => {
  const userData = JSON.parse(sessionStorage.getItem('userData'));
  const dateFormatPref = userData?.theme?.[0]?.dateFormat || 'dd/mm/yyyy';
  const timeFormatPref = userData?.theme?.[0]?.timeFormat || 'HH:mm:ss';

  const m = formatType ? moment(date, formatType) : moment(date);

  const dateFormats = {
    'yyyy/mm/dd': 'YYYY/MM/DD',
    'yyyy.mm.dd': 'YYYY.MM.DD',
    'yyyy-mm-dd': 'YYYY-MM-DD',

    'mm/dd/yy': 'MM/DD/YY',
    'mm.dd.yy': 'MM.DD.YY',
    'mm-dd-yy': 'MM-DD-YY',

    'mm/dd/yyyy': 'MM/DD/YYYY',
    'mm.dd.yyyy': 'MM.DD.YYYY',
    'mm-dd-yyyy': 'MM-DD-YYYY',

    'dd/mm/yyyy': 'DD/MM/YYYY',
    'dd.mm.yyyy': 'DD.MM.YYYY',
    'dd-mm-yyyy': 'DD-MM-YYYY',

    'dd/mmmm/yyyy': 'DD/MMMM/YYYY',
    'dd.mmmm.yyyy': 'DD.MMMM.YYYY',
    'dd-mmmm-yyyy': 'DD-MMMM-YYYY',
  };

  const baseFormat = dateFormats[dateFormatPref.toLowerCase()];
  if (!baseFormat) return 'Invalid format type';

  // Normalize time format
  let timeFormat = 'HH:mm:ss';
  if (
    timeFormatPref.toUpperCase().includes('AM') ||
    timeFormatPref.includes('hh')
  ) {
    timeFormat = 'hh:mm:ss A'; // 12-hour format with AM/PM
  } else {
    timeFormat = 'HH:mm:ss'; // 24-hour format
  }

  const finalFormat = includeTime ? `${baseFormat} ${timeFormat}` : baseFormat;

  return m.isValid() ? m.format(finalFormat) : date;
};
export const getHighlightedText = (text, highlight) => {
  if (!highlight) return text;

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <span
        key={index}
        style={{ backgroundColor: '#ffcb7f' }}
      >
        {part}
      </span>
    ) : (
      part
    )
  );
};

export const emojiOptions = [
  {
    icon: '/images/emoji/1.svg',
    iconActive: '/images/emoji/1(1).svg',
    //title: 'Feel Bad',
    title: 'Not my Vibe',
  },
  {
    icon: '/images/emoji/3.svg',
    iconActive: '/images/emoji/3(1).svg',
    //title: 'Little Okay',
    title: 'Could be Better',
  },
  {
    icon: '/images/emoji/2.svg',
    iconActive: '/images/emoji/2(1).svg',
    //title: 'Okay',
    title: 'Meh',
  },
  {
    icon: '/images/emoji/4(1).svg',
    iconActive: '/images/emoji/4.svg',
    //title: 'Little Happy',
    title: 'Happy',
  },
  {
    icon: '/images/emoji/happy1.svg',
    iconActive: '/images/emoji/happy.svg',
    //title: 'Happy',
    title: 'AHHHMAZING!',
  },
];
