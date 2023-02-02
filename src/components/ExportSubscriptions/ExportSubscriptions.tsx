import React, { useEffect, useState } from 'react';
import useExportSubscriptions from '../../hooks/useExportSubscriptions';
import ExportIcon from '@patternfly/react-icons/dist/js/icons/export-icon';
import { Tooltip } from '@patternfly/react-core';
import useNotifications from '../../hooks/useNotifications';

const ExportSubscriptions = () => {
  const { data, refetch, error } = useExportSubscriptions();
  const [shouldDownload, setShouldDownload] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { addErrorNotification } = useNotifications();

  useEffect(() => {
    if (error) {
      addErrorNotification('Something went wrong. Try exporting again.', {
        hasTimeout: true
      });
    }
  }, [error]);

  useEffect(() => {
    if (data && shouldDownload) {
      const a = document.createElement('a');
      a.setAttribute('display', 'hidden');
      a.href = window.URL.createObjectURL(data.blob);
      a.download = data.filename;
      a.click();
      a.remove();
      setShouldDownload(false);
    }
  }, [data, shouldDownload]);

  const defaultStyle = {
    color: '#6a6e73'
  };

  const hoveredStyle = {
    cursor: 'pointer',
    color: '#151515'
  };

  const onClick = () => {
    setShouldDownload(true);
    refetch();
  };

  return (
    <Tooltip
      content={
        <div>
          Export your full subscription inventory to a CSV file. The CSV file includes information
          from both the <i>All subscriptions</i> and <i>Subscription details</i> tables.
        </div>
      }
    >
      <ExportIcon
        id="export-button"
        style={hovered ? hoveredStyle : defaultStyle}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
    </Tooltip>
  );
};

export { ExportSubscriptions };
