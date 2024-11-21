import Input from './Cards/Input.vue';
import Selector from './Cards/Selector.vue';
import ImageUploader from './Cards/ImageUploader.vue';
import FileUploader from './Cards/FileUploader.vue';
import DateTimePicker from './Cards/DateTimePicker.vue';
import TableInput from './Cards/TableInput.vue';

import Target from './Layouts/Target.vue';
import Milestone from './Layouts/Milestone.vue';

export const Components = {
  Input,
  Selector,
  ImageUploader,
  FileUploader,
  DateTimePicker,
  TableInput,
  Target,
  Milestone,
  Collector: Milestone
};
export const getComponent = (Name) => Components[Name];
