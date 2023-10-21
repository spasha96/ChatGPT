import { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import { path, shell } from '@tauri-apps/api';

import { chatRoot } from '@/utils';

interface FilePathProps {
  paths?: string;
  label?: string;
  className?: string;
  content?: string;
  url?: string;
}

const FilePath: FC<FilePathProps> = ({ className, label = 'PATH', paths = '', url, content }) => {
  const [filePath, setPath] = useState('');

  useEffect(() => {
    if (!(paths || url)) return;

    (async () => {
      if (url) {
        setPath(url);
        return;
      }
      setPath(await path.join(await chatRoot(), ...paths.split('/').filter((i) => !!i)));
    })();
  }, [url, paths]);

  const downloadFile = () => {
    // Fetch the file from the URL
    fetch(filePath)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'downloaded_file';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error fetching file:', error);
      });
  };

  return (
    <div className={clsx(className, 'chat-file-path')}>
      <div>
        {label}:{' '}
        <a onClick={downloadFile} title={filePath}>
          {content ? content : filePath}
        </a>
      </div>
    </div>
  );
};

export default FilePath;
