import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';
import { decodeEntities } from '@wordpress/html-entities';
import { SearchControl, Spinner, Button, TextControl, Modal } from '@wordpress/components';
import { useState, render } from '@wordpress/element';

export function EditPageForm( { pageId, onCancel, onSaveFinished } ) {
    const { page, lastError, isSaving, hasEdits } = useSelect(
        ( select ) => ( {
            page: select( coreDataStore ).getEditedEntityRecord( 'postType', 'page', pageId ),
            lastError: select( coreDataStore ).getLastEntitySaveError( 'postType', 'page', pageId ),
            isSaving: select( coreDataStore ).isSavingEntityRecord( 'postType', 'page', pageId ),
            hasEdits: select( coreDataStore ).hasEditsForEntityRecord( 'postType', 'page', pageId ),
        } ),
        [ pageId ]
    );
 
    const { saveEditedEntityRecord, editEntityRecord } = useDispatch( coreDataStore );
    const handleSave = async () => {
        const savedRecord = await saveEditedEntityRecord( 'postType', 'page', pageId );
        if ( savedRecord ) {
            onSaveFinished();
        }
    };
    const handleChange = ( title ) =>  editEntityRecord( 'postType', 'page', page.id, { title } );
 
    return (
        <div className="my-gutenberg-form">
            <TextControl
                label="Page title:"
                value={ page.title }
                onChange={ handleChange }
            />
            { lastError ? (
                <div className="form-error">Error: { lastError.message }</div>
            ) : (
                false
            ) }
            <div className="form-buttons">
                <Button
                    onClick={ handleSave }
                    variant="primary"
                    disabled={ ! hasEdits || isSaving }
                >
                    { isSaving ? (
                        <>
                            <Spinner/>
                            Saving
                        </>
                    ) : 'Save' }
                </Button>
                <Button
                    onClick={ onCancel }
                    variant="tertiary"
                    disabled={ isSaving }
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}

function PageEditButton( { pageId } ) {
    const [ isOpen, setOpen ] = useState( false );
    const openModal = () => setOpen( true );
    const closeModal = () => setOpen( false );
    return (
        <>
            <Button onClick={ openModal } variant="primary">
                Edit
            </Button>
            { isOpen && (
                <Modal onRequestClose={ closeModal } title="Edit page">
                    <EditPageForm
                        pageId={ pageId }
                        onCancel={ closeModal }
                        onSaveFinished={ closeModal }
                    />
                </Modal>
            ) }
        </>
    );
}

export function VanillaReactForm({ initialTitle }) {
    const [title, setTitle] = useState( initialTitle );
    return (
        <TextControl
            value={ title }
            onChange={ setTitle }
        />
    );
}

function MyFirstApp() {
    const [searchTerm, setSearchTerm] = useState( '' );
    const query = {}
    if (searchTerm) {
        query.search = searchTerm
    }

   

    const { pages, hasResolved } = useSelect(
        ( select ) => {
            return {
                pages: select( coreDataStore ).getEntityRecords( 'postType', 'page', query ),
                hasResolved: select( coreDataStore ).hasFinishedResolution( 'getEntityRecords', [ 'postType', 'page', query ] ),
            }
        }, [searchTerm] )

    return (
        <div>
            <SearchControl
                label="Search Pages"
                value={ searchTerm }
                onChange={ setSearchTerm }
            />
            <PagesList hasResolved={ hasResolved } pages={ pages } />
        </div>
    )
}

function PagesList( { hasResolved, pages } ) {
    if ( ! hasResolved ) {
        return <Spinner />;
    }
    if ( ! pages?.length ) {
        return <div>No results</div>;
    }
 
    return (
        <table className="wp-list-table widefat fixed striped table-view-list">
            <thead>
                <tr>
                    <td>Title</td>
                    <td style={{width: 120}}>Actions</td>
                </tr>
            </thead>
            <tbody>
                { pages?.map( ( page ) => (
                    <tr key={page.id}>
                        <td>{ decodeEntities( page.title.rendered ) }</td>
                        <td>
                            <PageEditButton pageId={page.id} />
                        </td>
                    </tr>
                ) ) }
            </tbody>
        </table>
    );
}

window.addEventListener(
    'load',
    function () {
        render(
            <MyFirstApp />,
            document.querySelector( '#my-first-gutenberg-app' )
        );
    },
    false
);