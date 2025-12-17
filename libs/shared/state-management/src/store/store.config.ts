import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { projectsReducer } from './projects/projects.reducer';
import { ProjectsEffects } from './projects/projects.effects';
import { tasksReducer } from './tasks/tasks.reducer';
import { TasksEffects } from './tasks/tasks.effects';
import { projectsFeatureKey } from './projects/projects.selectors';
import { tasksFeatureKey } from './tasks/tasks.selectors';

export const storeConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      StoreModule.forRoot(
        {
          [projectsFeatureKey]: projectsReducer,
          [tasksFeatureKey]: tasksReducer,
        },
        {
          runtimeChecks: {
            strictStateImmutability: true,
            strictActionImmutability: true,
            strictStateSerializability: true,
            strictActionSerializability: true,
            strictActionWithinNgZone: true,
            strictActionTypeUniqueness: true,
          },
        }
      ),
      EffectsModule.forRoot([ProjectsEffects, TasksEffects]),
      StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: true })
    ),
  ],
};
