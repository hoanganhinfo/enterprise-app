package tms.backend.job;

import java.awt.image.BufferedImage;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;

import com.liferay.portal.kernel.dao.orm.QueryUtil;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.exception.SystemException;
import com.liferay.portal.kernel.messaging.Message;
import com.liferay.portal.kernel.messaging.MessageListener;
import com.liferay.portal.kernel.messaging.MessageListenerException;
import com.liferay.portal.kernel.repository.model.FileEntry;
import com.liferay.portal.kernel.repository.model.FileVersion;
import com.liferay.portal.kernel.repository.model.Folder;
import com.liferay.portal.kernel.search.BooleanClause;
import com.liferay.portal.kernel.search.BooleanClauseFactoryUtil;
import com.liferay.portal.kernel.search.BooleanClauseOccur;
import com.liferay.portal.kernel.search.Document;
import com.liferay.portal.kernel.search.Hits;
import com.liferay.portal.kernel.search.Indexer;
import com.liferay.portal.kernel.search.IndexerRegistryUtil;
import com.liferay.portal.kernel.search.SearchContext;
import com.liferay.portal.kernel.search.SearchException;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.model.User;
import com.liferay.portal.security.auth.PrincipalThreadLocal;
import com.liferay.portal.security.permission.PermissionChecker;
import com.liferay.portal.security.permission.PermissionCheckerFactoryUtil;
import com.liferay.portal.security.permission.PermissionThreadLocal;
import com.liferay.portal.service.ClassNameLocalServiceUtil;
import com.liferay.portal.service.UserLocalServiceUtil;
import com.liferay.portlet.documentlibrary.model.DLFileEntry;
import com.liferay.portlet.documentlibrary.model.DLFileEntryConstants;
import com.liferay.portlet.documentlibrary.model.DLFileEntryType;
import com.liferay.portlet.documentlibrary.model.DLFileVersion;
import com.liferay.portlet.documentlibrary.service.DLAppServiceUtil;
import com.liferay.portlet.documentlibrary.service.DLFileEntryLocalServiceUtil;
import com.liferay.portlet.documentlibrary.service.DLFileEntryTypeLocalServiceUtil;
import com.liferay.portlet.documentlibrary.service.DLFileVersionLocalServiceUtil;
import com.liferay.portlet.dynamicdatamapping.model.DDMStructure;
import com.liferay.portlet.dynamicdatamapping.util.DDMIndexerUtil;
import com.liferay.portlet.expando.model.ExpandoTableConstants;
import com.liferay.portlet.expando.model.ExpandoValue;
import com.liferay.portlet.expando.service.ExpandoValueLocalServiceUtil;

import net.sourceforge.tess4j.Tesseract;
import tms.backend.service.TaskService;
import tms.utils.Config;

public class DocumentOCRJob implements MessageListener {

	private TaskService taskService;

	@Override
	public void receive(Message arg0) throws MessageListenerException {
		System.out.println("Start DocumentOCRJob ... ");
		//searchByMetaData();
		searchByCustomsField();
	}

	public void searchByMetaData() {

		try {
			User user =  UserLocalServiceUtil.getUser(20199);
			DLFileEntryType feType = feType = DLFileEntryTypeLocalServiceUtil.getFileEntryType(
					20195, "ONLINE TRAINING");
			List<DDMStructure> structures;
			structures = feType.getDDMStructures();
			DDMStructure ddmStructure = structures.get(0);
			System.out.println(ddmStructure.getDescription());
			System.out.println(ddmStructure.getStructureId());
			System.out.println("-----");
			// Obtain proper Indexer
			Indexer indexer = IndexerRegistryUtil.getIndexer(DLFileEntryConstants.getClassName());

			// Create SearchContext
			SearchContext sc = new SearchContext();
			 String testText = DDMIndexerUtil.encodeName(
					 ddmStructure.getStructureId(), "OCR", LocaleUtil.fromLanguageId("en_US"));
			 BooleanClause testTextClause = BooleanClauseFactoryUtil.create(
			            sc, testText, "No", BooleanClauseOccur.MUST.getName());
			sc.setCompanyId(feType.getCompanyId());
			sc.setGroupIds(user.getGroupIds());
			sc.setBooleanClauses(new BooleanClause[]{testTextClause} );

			sc.setAndSearch(true);
			sc.setStart(QueryUtil.ALL_POS);
			sc.setEnd(QueryUtil.ALL_POS);
			sc.setAttribute("paginationType", "none");

			Hits hits = indexer.search(sc);

			for (Document doc : hits.toList()) {
				long fileEntryId = GetterUtil.getLong(doc.get("entryClassPK"));
				System.out.println(fileEntryId);
				try{

				DLFileEntry fileEntry =  DLFileEntryLocalServiceUtil.getDLFileEntry(fileEntryId);

				System.out.println(fileEntry.getTitle());
				}catch (Exception e) {
					// TODO: handle exception
				}
			}
		} catch (SystemException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SearchException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (PortalException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		/*
		User user;
		try {

			long companyId = 20155;// CompanyLocalServiceUtil.getCompanyByMx(PropsUtil.get("m-chemical.vn")).getCompanyId();
			ArrayList<Long> files = new ArrayList<>();
			user = UserLocalServiceUtil.getUser(20199);
			PrincipalThreadLocal.setName(user.getUserId());
			PermissionChecker permissionChecker;

			permissionChecker = PermissionCheckerFactoryUtil.create(user);
			PermissionThreadLocal.setPermissionChecker(permissionChecker);



			Indexer indexer = IndexerRegistryUtil.getIndexer(DLFileEntryConstants.getClassName());
			SearchContext sc = new SearchContext();
			Map<String, Serializable> attributes = new HashMap<String, Serializable>();

			sc.setCompanyId(companyId);
			//sc.setOwnerUserId(user.getUserId());
			//sc.setGroupIds(new long[] { user.getGroupId() });

			// Metadata
			attributes.put("Work_order", "1111");
			//attributes.put("MyMetadataField2", "value2");

			sc.setAttributes(attributes);
			sc.setAndSearch(true);
			sc.setStart(QueryUtil.ALL_POS);
			sc.setEnd(QueryUtil.ALL_POS);
			// sc.setAttribute("paginationType", "none");

			Hits hits = indexer.search(sc);

			for (Document doc : hits.toList()) {
				long fileEntryId = GetterUtil.getLong(doc.get("entryClassPK"));
				System.out.println(fileEntryId);
				try{
				FileEntry fileEntry =  DLAppServiceUtil.getFileEntry(fileEntryId);
				System.out.println(fileEntry.getTitle());
				}catch (Exception e) {
					// TODO: handle exception
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		*/

	}

	public void searchByCustomsField(){
		BufferedImage bufferedImage = null;
		byte[] imageInByte = null;
		String contentFile = null;
		System.out.println("Start DocumentOCRJob ... ");
		User user;
		try {

			long companyId = 20155;// CompanyLocalServiceUtil.getCompanyByMx(PropsUtil.get("m-chemical.vn")).getCompanyId();
			ArrayList<Long> files = new ArrayList<>();
			user = UserLocalServiceUtil.getUser(20199);
			PrincipalThreadLocal.setName(user.getUserId());
			PermissionChecker permissionChecker;

			permissionChecker = PermissionCheckerFactoryUtil.create(user);
			PermissionThreadLocal.setPermissionChecker(permissionChecker);
			Indexer indexer = IndexerRegistryUtil.getIndexer(DLFileEntryConstants.getClassName());


			long classNameId = ClassNameLocalServiceUtil.getClassNameId(DLFileEntry.class);
			List<ExpandoValue> values = ExpandoValueLocalServiceUtil.getColumnValues(companyId, classNameId,
					ExpandoTableConstants.DEFAULT_TABLE_NAME, "Ocr Processed", "false", -1, -1);
			for (int i = 0; i < values.size(); i++) {
				long fileVersionId = values.get(i).getClassPK();
				try {
					// System.out.println(fileEntryId);
					DLFileVersion fileVersion = DLFileVersionLocalServiceUtil.fetchDLFileVersion(fileVersionId);
					DLFileEntry file = fileVersion.getFileEntry();
					String latestversion = file.getLatestFileVersion(true).getVersion();
					System.out.println("latestversion: " + latestversion);
					System.out.println("fileversion: " + fileVersion.getVersion());
					if (fileVersion.getVersion() == latestversion){
						System.out.println(file.getTitle());
						file.getExpandoBridge().setAttribute("Ocr Processed", "true");

						Tesseract tesseract = new Tesseract();
						tesseract.setDatapath(Config.getInstance().getProperty("tesseract.path"));
						tesseract.setDatapath("tessdata");
						tesseract.setLanguage("vie");
						bufferedImage = ImageIO.read(file.getContentStream());
						contentFile = tesseract.doOCR(bufferedImage);
						System.out.println(contentFile);
						file.setDescription(contentFile);

					}else{
						DLAppServiceUtil.deleteFileVersion(file.getFileEntryId(), fileVersion.getVersion());
					}


				} catch (Exception e) {

				}
			}
			//
			/*
			 * Hits hits = indexer.search(sc);
			 *
			 * for (Document doc : hits.toList()) {
			 *
			 * long fileEntryId = GetterUtil.getLong(doc.get("entryClassPK"));
			 * try{ System.out.println(fileEntryId); FileEntry f =
			 * DLAppServiceUtil.getFileEntry(fileEntryId);
			 * System.out.println(f.getTitle()); Map<String, Serializable> map =
			 * f.getAttributes(); for (Entry<String, Serializable> entry :
			 * map.entrySet()) { System.out.println("Key : " + entry.getKey() +
			 * " Value : " + entry.getValue()); }
			 *
			 * }catch(Exception e){
			 *
			 * }
			 *
			 * }
			 */

		} catch (PortalException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SystemException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	private void deleteOldVersion(long groupId, long folderId) {

		// Param1: Group ID
		// Param2: Folder ID
		// listFiles(20182, 21642);
		// long groupId =
		List<FileEntry> allfiles;
		try {
			allfiles = DLAppServiceUtil.getFileEntries(groupId, folderId);
			for (FileEntry file : allfiles) {
				System.out.println("File Title: " + file.getTitle());
				System.out.println("File Version: " + file.getVersion());
				List<FileVersion> results = file.getFileVersions(-1);
				String latestversion = file.getVersion();
				for (FileVersion fv : results) {
					if (fv.getVersion() != latestversion) {
						System.out.println("Deleting >>" + fv.getVersion());
						DLAppServiceUtil.deleteFileVersion(file.getFileEntryId(), fv.getVersion());
					}
				}
			}

			List<Folder> allfolders = DLAppServiceUtil.getFolders(groupId, folderId);
			for (Folder folder : allfolders) {
				System.out.println("Folder Name: " + folder.getName());
				deleteOldVersion(groupId, folder.getFolderId());
			}
		} catch (PortalException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SystemException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}