import {test} from '../../../src/fixtures/test-fixtures';
import {AddRemoveElementsSteps} from '../../../src/ui/steps/AddRemoveElementsSteps';


test(
    'Should add ten elements at once',
    {tag: ['@TMS-1020', '@UI']},
    async ({page, logger}, testInfo) => {
        const addRemoveElementsSteps = new AddRemoveElementsSteps(page, testInfo, logger);

        await addRemoveElementsSteps.open();
        await addRemoveElementsSteps.addElements(10);
        await addRemoveElementsSteps.shouldHaveDeleteButtons(10);
        await addRemoveElementsSteps.checkElementsButtonText("Delete");
    }
);