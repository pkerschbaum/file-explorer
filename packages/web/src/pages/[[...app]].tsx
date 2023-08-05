import { queryClient, store } from '#pkg/initialize-global-modules';
import { Globals } from '#pkg/ui/Globals';
import { Shell } from '#pkg/ui/shell';

function SinglePageApp() {
  return (
    <Globals queryClient={queryClient} store={store}>
      <Shell />
    </Globals>
  );
}

export default SinglePageApp;
