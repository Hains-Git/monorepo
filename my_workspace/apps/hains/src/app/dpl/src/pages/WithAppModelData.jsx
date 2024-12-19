import { useEffect } from 'react';
import Spinner from '../components/utils/spinner/Spinner';

function ComponentWithAppModelData(props) {
  const { BaseComponent, appModel, user, otherProps } = props;
  if (!user) return null;
  if (!appModel) return <Spinner showText text="Daten werden geladen..." />;
  return <BaseComponent {...otherProps} appModel={appModel} user={user} />;
}

function HOC({ props, BaseComponent, otherProps }) {
  useEffect(() => {
    props.getAppData();
  }, [props, props.isLoadingData]);

  return (
    <ComponentWithAppModelData
      BaseComponent={BaseComponent}
      appModel={props.appModel}
      user={props.user}
      otherProps={otherProps}
    />
  );
}

export default function withAppModelData(props) {
  return (BaseComponent, otherProps = {}) => (
    <HOC props={props} BaseComponent={BaseComponent} otherProps={otherProps} />
  );
}
